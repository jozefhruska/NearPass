import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';

class PasswordRecord {
  index: number;
  link: string;
  passwordName: string;
  password: string;
  username: string;
}
const assert = (condition, message) => {
  if (!condition) {
    throw Error(message);
  }
}

@NearBindgen({})
class PasswordManager {
  records: UnorderedMap<Array<PasswordRecord>> = new UnorderedMap<Array<PasswordRecord>>('records-map');

  @view({})
  get_password_record({
    accountId,
  }): Array<PasswordRecord> {
    return this.records.get(accountId) || []
  }

  @call({})
  delete_password_record({
    index,
  }: {
    index: number,
  }): void {
    let accountId = near.signerAccountId();
    assert(index !== undefined, 'Index has to be present to delete a password!');
    assert(typeof index === 'number', 'Index has to be of type number!');
    const currentlyStoredPasswords = this.records.get(accountId) || [];
    assert(
      !!currentlyStoredPasswords.find(record => record.index === index),
      'This record does not exist in this account!'
    );
    const newRecords = currentlyStoredPasswords.filter(record => record.index !== index)
    const newRecordsReindexed = newRecords.map((record, i) => ({
      ...record,
      index: i,
    }))
    this.records.set(accountId, newRecordsReindexed)
  }

  @call({})
  set_password_record({
    index,
    link,
    passwordName,
    password,
    username,
  }: {
    index?: number, // If index is not provided then this is a new entry
    link: string,
    passwordName: string,
    password: string,
    username: string,
  }): void {
    // Type checking
    assert(typeof link === 'string', 'Parameter link has to be present and of string type to set a password record!');
    assert(typeof passwordName === 'string', 'Parameter passwordName has to be present and of string type to set a password record!');
    assert(typeof password === 'string', 'Parameter password has to be present and of string type to set a password record!');
    assert(typeof username === 'string', 'Parameter username has to be present and of string type to set a password record!');
    // Checking whether encrypted strings are within specified bounds
    assert(link.length <= 152, 'Parameter link (URL) is too long to be stored in this smart contract.');
    assert(passwordName.length <= 128, 'Parameter passwordName is too long to be stored in this smart contract.');
    assert(password.length <= 128, 'Parameter password is too long to be stored in this smart contract.');
    assert(username.length <= 128, 'Parameter username is too long to be stored in this smart contract.');

    let accountId = near.signerAccountId();
    const currentlyStoredPasswords = this.records.get(accountId) || []
    const newPasswordEntry: PasswordRecord = {
      index: typeof index === 'number' ? index : currentlyStoredPasswords.length,
      link,
      passwordName,
      password,
      username,
    }
    // We save according to an anonymized index so no private data are exposed in blockchain
    if (typeof index === 'number') {
      const newRecords = currentlyStoredPasswords.map(record => {
        if (record.index === newPasswordEntry.index) {
          return newPasswordEntry
        }
        return record
      })
      this.records.set(accountId, newRecords)
    } else {
      currentlyStoredPasswords.push(newPasswordEntry)
      this.records.set(accountId, currentlyStoredPasswords)
    }
  }
}
