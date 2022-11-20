import {testnetAccountInfo} from './secrets';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nearAPI = require('near-api-js');


export const getAccountNearConnection = async () => {
  const myKeyStore = new nearAPI.keyStores.InMemoryKeyStore();
  // creates a public / private key pair using the provided private key
  const keyPair = nearAPI.KeyPair.fromString(testnetAccountInfo.key);
  // adds the keyPair you created to keyStore
  await myKeyStore.setKey('testnet', testnetAccountInfo.accountId, keyPair);
  const connectionConfig = {
    networkId: 'testnet',
    keyStore: myKeyStore, // first create a key store
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  };
  return nearAPI.connect(connectionConfig);
};

export const sendTokensFromFeedAccount = async (accountId: string) => {
  const nearConnection = await getAccountNearConnection();
  const account = await nearConnection.account(testnetAccountInfo.accountId);
  const amountInYoctoNear = nearAPI.utils.format.parseNearAmount('0.1');
  await account.sendMoney(
      accountId,
      amountInYoctoNear,
  );
};

export const setContractAllowance = async (accountId: string) => {
  const nearConnection = await getAccountNearConnection();
  const account = await nearConnection.account(testnetAccountInfo.accountId);
  const contract = new nearAPI.Contract(
      account,
      'near-pass.testnet',
      {
        changeMethods: ['prepay_for_another_user'],
        viewMethods: [],
      });
  const amountInYoctoNear = nearAPI.utils.format.parseNearAmount('0.3');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await contract.prepay_for_another_user({
    args: {
      accountId, // argument name and value - pass empty object if no args required
    },
    amount: amountInYoctoNear, // attached deposit in yoctoNEAR (optional)
  });
};
