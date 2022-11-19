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

const pricePerByte = BigInt(10000000000000000000)

@NearBindgen({})
class PasswordManager {
  // Amount of yoctoNEAR stored by each user for their records
  prepaidStorage: UnorderedMap<bigint> = new UnorderedMap<bigint>('prepaid-map')
  records: UnorderedMap<Array<PasswordRecord>> = new UnorderedMap<Array<PasswordRecord>>('records-map');

  // Get all password records
  @view({})
  get_password_records({
    accountId,
  }): Array<PasswordRecord> {
    return this.records.get(accountId) || []
  }

  // 1) Calculates remaining storage for a user on contract
  // 2) On top of that it can calculate remaining storage after new contract would be added
  @view({})
  get_user_remaining_storage({
    accountId,
    afterThisRecordWouldBeAdded,
  }: {
    accountId: string,
    afterThisRecordWouldBeAdded?: PasswordRecord,
  }): string {
    const currentStorageUse = this.get_current_storage_usage(accountId);
    const storageStakingByUser = pricePerByte * BigInt(currentStorageUse);
    const futureStakingNeededByUser = afterThisRecordWouldBeAdded
      ? BigInt(JSON.stringify(afterThisRecordWouldBeAdded).length) * pricePerByte
      : BigInt(0)
    const prepaidAmount = this.prepaidStorage.get(accountId, {defaultValue: BigInt(0)});
    const remainingStorage = prepaidAmount - storageStakingByUser - futureStakingNeededByUser;
    return remainingStorage.toString()
  }

  // Deletes password record according to index for user which calls this method
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

  // Sets (creates or edits) password record according to whether index was provided
  private set_password_record_internal({
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

    const accountId = near.signerAccountId();
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

  // Calculates current storage usage for specified account id
  private get_current_storage_usage(accountId: string): number {
    const currentlyStoredPasswords = this.records.get(accountId) || []
    const currentlyUsedBytesForPasswords = JSON.stringify(currentlyStoredPasswords).length
    const storageRequiredForBookkeeping = 50 // for prepaid storage + some reserve
    return storageRequiredForBookkeeping + currentlyUsedBytesForPasswords
  }

  // 1) Prepays specified amount of storage for caller's accountId
  // 2) Sets (creates or edits) password record according to whether index was provided
  @call({ payableFunction: true })
  prepay_and_set_password_record(
    passwordRecord: {
    index?: number, // If index is not provided then this is a new entry
    link: string,
    passwordName: string,
    password: string,
    username: string,
  }): void {
    const accountId = near.signerAccountId();
    const prepaidAmount: bigint = near.attachedDeposit() as bigint;
    const prepaidSoFar = this.prepaidStorage.get(accountId, {defaultValue: BigInt(0)});
    const newPrepaidAmount = prepaidAmount + prepaidSoFar;
    const storageUsageForNewEntry = JSON.stringify(passwordRecord).length;
    const newStorageUsage = this.get_current_storage_usage(accountId) + storageUsageForNewEntry;
    const newStorageStakingByUser = pricePerByte * BigInt(newStorageUsage);
    assert(
      newStorageStakingByUser <= newPrepaidAmount,
      `You need to deposit atleast ${newStorageStakingByUser - newPrepaidAmount} yoctoNEAR to cover your new storage costs.`
    );
    this.set_password_record_internal(passwordRecord);
    this.prepaidStorage.set(accountId, newPrepaidAmount);
  }

  // 1) Should only be called if get_user_remaining_storage returns positive value; otherwise this
  //    will throw an exception
  // 2) Sets (creates or edits) password record according to whether index was provided
  @call({})
  set_password_record(
    passwordRecord: {
    index?: number, // If index is not provided then this is a new entry
    link: string,
    passwordName: string,
    password: string,
    username: string,
  }): void {
    const accountId = near.signerAccountId();
    const prepaidAmount = this.prepaidStorage.get(accountId, {defaultValue: BigInt(0)});
    const storageUsageForNewEntry = JSON.stringify(passwordRecord).length;
    const newStorageUsage = this.get_current_storage_usage(accountId) + storageUsageForNewEntry;
    const newStorageStakingByUser = pricePerByte * BigInt(newStorageUsage);
    assert(
      newStorageStakingByUser <= prepaidAmount,
      `You need to deposit atleast ${newStorageStakingByUser - prepaidAmount} yoctoNEAR to cover your new storage costs.`
    );
    this.set_password_record_internal(passwordRecord);
  }

  // Enables to prepay storage for different account
  @call({ payableFunction: true })
  prepay_for_another_user({
    accountId,
  }: {
    accountId: string,
  }): void {
    const prepaidAmount: bigint = near.attachedDeposit() as bigint;
    // A bit arbitrary, but should approximately cover entry in `prepaidStorage` UnorderedMap
    const minimumPrepay = BigInt(50) * pricePerByte
    assert(
      minimumPrepay <= prepaidAmount,
      `You need to prepay atleast ${minimumPrepay} yoctoNEAR to cover basic storage costs.`
    );
    const prepaidSoFar = this.prepaidStorage.get(accountId, {defaultValue: BigInt(0)});
    const newPrepaidAmount = prepaidAmount + prepaidSoFar;
    this.prepaidStorage.set(accountId, newPrepaidAmount);
  }
}
