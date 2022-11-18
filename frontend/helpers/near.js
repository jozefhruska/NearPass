import { connect, keyStores } from 'near-api-js';
import { networkId } from './constants';

const connectionConfig = networkId === 'testnet'
  ? {
    networkId,
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  }
  : {
    networkId,
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
  };

export const getNearConnection = () => connect(connectionConfig);
export const getAccount = async (wallet) => {
  const nearConnection = await getNearConnection();
  return nearConnection.account(wallet.accountId);
};

// This will always show 3 digits at some point after decimal point
// I.e. 199.319, 11.939, 10231.120, 0.123, 0.0000394...
export const sanitizeYoctoNear = (value) => {
  const substraction = (24 > value.length ? value.length : 24) - 3
  const numberOfZeros = 24 - substraction
  return parseFloat(value.substring(0, value.length - substraction)) / 10 ** numberOfZeros;
}

export const getAccountBalanceObject = async (wallet) => {
  const account = await getAccount(wallet);
  return account.getAccountBalance();
};

export const getTotalAccountBalanceSanitized = async (wallet) => {
  const account = await getAccount(wallet);
  const balance = await account.getAccountBalance();
  return sanitizeYoctoNear(balance.total);
};
