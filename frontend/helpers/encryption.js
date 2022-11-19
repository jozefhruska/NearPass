import { firestoreHttpsCallable } from './util';
import { AES, enc } from 'crypto-js';

export const decryptAndSetRecords = async ({
  keyPhrase,
  passwordRecords,
  setIsDecrypting,
  setIsIncorrectPassPhrase,
  setDecryptedContractResponse,
  closeKeyPhraseModal,
  wallet,
}) => {
  setIsDecrypting(true);
  let didFail = false;
  let wasOnePasswordCorrect = false;
  const decryptedPasswordRecords = await Promise.all((passwordRecords).map(async (encryptedPasswordRecord, id) => {
    try {
      const responseDecrypt = await firestoreHttpsCallable('secondRoundDecrypt', {
        passwordRecord: encryptedPasswordRecord,
        userId: wallet?.accountId,
      });
      const decryptedPasswordRecord = responseDecrypt?.data?.passwordRecord;
      const decryptedFirstRound = {
        index: decryptedPasswordRecord.index,
        link: decryptedPasswordRecord.link
          ? AES.decrypt(decryptedPasswordRecord.link, keyPhrase).toString(enc.Utf8)
          : '',
        username: decryptedPasswordRecord.username
          ? AES.decrypt(decryptedPasswordRecord.username, keyPhrase).toString(enc.Utf8)
          : '',
        password: AES.decrypt(decryptedPasswordRecord.password, keyPhrase).toString(enc.Utf8),
        passwordName: AES.decrypt(decryptedPasswordRecord.passwordName, keyPhrase).toString(enc.Utf8),
      };
      if (decryptedFirstRound.passwordName && decryptedFirstRound.password) {
        setIsIncorrectPassPhrase(false);
        wasOnePasswordCorrect = true;
        return ({
          id,
          ...decryptedFirstRound,
        });
      }
    } catch (e) {
      didFail = true;
    }
  }));
  if (!didFail) {
    setDecryptedContractResponse(decryptedPasswordRecords.filter(value => value));
  }
  setIsIncorrectPassPhrase(!wasOnePasswordCorrect);
  if (wasOnePasswordCorrect) {
    closeKeyPhraseModal();
  }
  setIsDecrypting(false);
};

export const getPasswordRecords = async ({
  PasswordManagerSC,
  setContractResponse,
  keyPhrase,
  setIsDecrypting,
  setIsIncorrectPassPhrase,
  setDecryptedContractResponse,
  closeKeyPhraseModal,
  wallet,
}) => {
  const passwordRecords = await PasswordManagerSC.getPasswordRecords(wallet?.accountId);
  setContractResponse(passwordRecords);
  if (passwordRecords.length && keyPhrase) {
    await decryptAndSetRecords({
      keyPhrase,
      passwordRecords,
      setIsDecrypting,
      setIsIncorrectPassPhrase,
      setDecryptedContractResponse,
      closeKeyPhraseModal,
      wallet,
    });
  } else { // In case user has no passwords yet, accept any string
    setDecryptedContractResponse([]);
    setIsIncorrectPassPhrase(false);
  }
};
