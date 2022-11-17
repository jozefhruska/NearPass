/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class NEARPasswordManager {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async getPasswordRecord(accountId) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'get_password_record', args: { accountId } });
  }

  async setPasswordRecord({
    index,
    link,
    passwordName,
    password,
    username,
  }) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'set_password_record',
      args: {
        index,
        link,
        passwordName,
        password,
        username,
      },
    });
  }

  async deletePasswordRecord({
    index,
  }) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'delete_password_record',
      args: {
        index,
      },
    });
  }
}
