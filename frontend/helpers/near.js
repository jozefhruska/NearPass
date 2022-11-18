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

// This will provide amount of near on the account + 2 numbers after decimal point
export const sanitizeYoctoNear = (value) => parseFloat(value.substring(0, value.length - 22)) / 100

export const getAccountBalanceObject = async (wallet) => {
  const account = await getAccount(wallet);
  return account.getAccountBalance();
};

export const getTotalAccountBalanceSanitized = async (wallet) => {
  const account = await getAccount(wallet);
  const balance = await account.getAccountBalance();
  return sanitizeYoctoNear(balance.total);
};
