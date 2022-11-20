import {mainnetAccountInfo} from './secrets';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nearAPI = require('near-api-js');


export const getAccountNearConnection = async () => {
  const myKeyStore = new nearAPI.keyStores.InMemoryKeyStore();
  // creates a public / private key pair using the provided private key
  const keyPair = nearAPI.KeyPair.fromString(mainnetAccountInfo.key);
  // adds the keyPair you created to keyStore
  await myKeyStore.setKey('mainnet', mainnetAccountInfo.accountId, keyPair);
  const connectionConfig = {
    networkId: 'mainnet',
    keyStore: myKeyStore,
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
  };
  return nearAPI.connect(connectionConfig);
};

export const sendTokensFromFeedAccount = async (accountId: string) => {
  const nearConnection = await getAccountNearConnection();
  const account = await nearConnection.account(mainnetAccountInfo.accountId);
  const amountInYoctoNear = nearAPI.utils.format.parseNearAmount('0.1');
  await account.sendMoney(
      accountId,
      amountInYoctoNear,
  );
};

export const setContractAllowance = async (accountId: string) => {
  const nearConnection = await getAccountNearConnection();
  const account = await nearConnection.account(mainnetAccountInfo.accountId);
  const contract = new nearAPI.Contract(
      account,
      'nearpass.near',
      {
        changeMethods: ['prepay_for_another_user'],
        viewMethods: [],
      });
  const amountInYoctoNear = nearAPI.utils.format.parseNearAmount('0.3');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await contract.prepay_for_another_user({
    args: {
      accountId,
    },
    amount: amountInYoctoNear,
  });
};
