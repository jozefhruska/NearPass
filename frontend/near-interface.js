import { utils } from 'near-api-js'

export class NEARPasswordManager {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  getPasswordRecords = async (accountId) => {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'get_password_records', args: { accountId } });
  }

  getRemainingStorage = async (accountId, afterThisRecordWouldBeAdded) => {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'get_user_remaining_storage', args: { accountId, afterThisRecordWouldBeAdded } });
  }

  setPasswordRecord = async ({
    index,
    link,
    passwordName,
    password,
    username,
  }) => {
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

  prepayAndSetPasswordRecord = async ({
    index,
    link,
    passwordName,
    password,
    username,
  }) => {
    const deposit = utils.format.parseNearAmount('0.1')
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'prepay_and_set_password_record',
      deposit,
      args: {
        index,
        link,
        passwordName,
        password,
        username,
      },
    });
  }

  prepayForAnotherUser = async ({
    accountId,
    amount,
  }) => {
    const deposit = utils.format.parseNearAmount(amount.toString())
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'prepay_for_another_user',
      deposit,
      args: {
        accountId,
      },
    });
  }

  deletePasswordRecord = async ({
    index,
  }) => {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'delete_password_record',
      args: {
        index,
      },
    });
  }
}
