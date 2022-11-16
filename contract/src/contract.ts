import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';

class PasswordRecord {
  index: number;
  link?: string;
  passwordName: string;
  password: string;
  username?: string;
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
    username?: string,
  }): void {
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
