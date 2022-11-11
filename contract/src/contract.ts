import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';

class PasswordRecord {
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
    return this.records.get(accountId)
  }

  @call({})
  set_password_record({
    link,
    passwordName,
    password,
    username,
  }: {
    link: string,
    passwordName: string,
    password: string,
    username?: string,
  }): void {
    let accountId = near.signerAccountId();

    const newPasswordEntry: PasswordRecord = {
      link,
      passwordName,
      password,
      username,
    }
    const currentlyStoredPasswords = this.records.get(accountId) || []
    // Ensure that if we are storing password with the same name that we don't save duplicate
    // (overwrite instead)
    if (currentlyStoredPasswords.find(record => record.passwordName === passwordName)) {
      currentlyStoredPasswords.map(record => {
        if (record.passwordName === passwordName) {
          return newPasswordEntry
        }
        return record
      })
    } else {
      currentlyStoredPasswords.push(newPasswordEntry)
    }
    this.records.set(accountId, currentlyStoredPasswords)
  }
}
