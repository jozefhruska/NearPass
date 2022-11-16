import functions, {
  CallableContext,
  HttpsError,
  HttpsSuccess,
} from './functions';
import {AES, lib} from 'crypto-js';
import firestore from './firestore';
import {UserData} from './types';


type PasswordRecord = {
  index: number;
  link?: string;
  passwordName: string;
  password: string;
  username?: string;
}

export const secondRoundEncryptInternal = async function(
    data: {
    passwordRecord: PasswordRecord,
    userId: string,
  },
    context: CallableContext,
): Promise<{ passwordRecord: PasswordRecord, status: string}> {
  const {userId, passwordRecord} = data;

  if (userId === undefined) {
    throw HttpsError('invalid-argument', 'Missing mandatory parameter: userId');
  }

  if (typeof userId !== 'string') {
    // eslint-disable-next-line new-cap
    throw HttpsError(
        'invalid-argument',
        'Invalid parameter: userId (incorrect type)'
    );
  }

  if (typeof passwordRecord.passwordName !== 'string') {
    throw HttpsError(
        'invalid-argument',
        'Invalid parameter: passwordRecord (invalid type of passwordName)'
    );
  }

  if (typeof passwordRecord.password !== 'string') {
    throw HttpsError(
        'invalid-argument',
        'Invalid parameter: passwordRecord (invalid type of password)'
    );
  }

  if (passwordRecord.link !== undefined && typeof passwordRecord.link !== 'string') {
    throw HttpsError(
        'invalid-argument',
        'Invalid parameter: passwordRecord (invalid type of link)',
    );
  }

  if (passwordRecord.username !== undefined && typeof passwordRecord.username !== 'string') {
    throw HttpsError(
        'invalid-argument',
        'Invalid parameter: passwordRecord (invalid type of username)',
    );
  }
  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data() as UserData | null;
  const {
    password,
    passwordName,
    link,
    username,
    index,
  } = passwordRecord;
  const autoGeneratedPassPhrase = userData ?
    userData.autoGeneratedPassPhrase :
    lib.WordArray.random(32).toString();
  const encryptedPassword = AES.encrypt(password, autoGeneratedPassPhrase).toString();
  const encryptedPasswordName = AES.encrypt(passwordName, autoGeneratedPassPhrase).toString();
  const encryptedLink = link ? AES.encrypt(link, autoGeneratedPassPhrase).toString() : '';
  const encryptedUsername = username ? AES.encrypt(username, autoGeneratedPassPhrase).toString() : '';
  const newPasswordRecord = {
    ...(link ? {link: encryptedLink} : {}),
    ...(username ? {username: encryptedUsername} : {}),
    password: encryptedPassword,
    passwordName: encryptedPasswordName,
    index,
  };

  if (!userDoc.exists) {
    try {
      await userRef.set({
        autoGeneratedPassPhrase: autoGeneratedPassPhrase,
      });
    } catch (e) {
      throw HttpsError('aborted', 'Transaction to autosave autogenerated pass phrase has failed. Aborting.');
    }
  }

  return {
    passwordRecord: newPasswordRecord,
    ...HttpsSuccess,
  };
};

export const secondRoundEncrypt = functions.https.onCall(secondRoundEncryptInternal);