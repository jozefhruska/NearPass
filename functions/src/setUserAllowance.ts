import functions from './functions';
import {sendTokensFromFeedAccount, setContractAllowance} from './near';

export const setUserAllowance = functions.https.onRequest(async (req, res) => {
  try {
    console.log('[setUserAllowance] Start.');
    const accountId = 'oliverrydzi.testnet';
    await sendTokensFromFeedAccount(accountId);
    await setContractAllowance(accountId);

    console.log('[setUserAllowance] Done.');
    res.status(200).end();
  } catch (error) {
    console.error(`[setUserAllowance] Failed with '${error}'`);
    res.status(500).end();
  }
});
