import functions from './functions';
import {sendTokensFromFeedAccount, setContractAllowance} from './near';
import Stripe from 'stripe';
import {stripeSecret, webhookSecret} from './secrets';
import firestore, {FieldValue} from './firestore';
import {UserPackages} from './types';

const apiVersion = '2022-11-15';
const stripe = new Stripe(stripeSecret, {
  apiVersion,
});

export const handleWebhookEvents = functions.https.onRequest(async (req, res) => {
  try {
    let event: any;
    try {
      event = stripe.webhooks.constructEvent(
          req.rawBody,
          req.headers['stripe-signature'] || '',
          webhookSecret,
      );
    } catch (error) {
      res.status(401).send(`Webhook construct event failed ${error}`);
      return;
    }
    console.log(`[handleStripeEvents] Started with '${JSON.stringify(event)}'`);
    const eventType = event.type;
    const accountId = event.data.object.client_reference_id.replace('__', '.');
    if (eventType === 'checkout.session.completed' && accountId) {
      await sendTokensFromFeedAccount(accountId);
      await setContractAllowance(accountId);
      const userRef = firestore.collection('userPackages').doc(accountId);
      const userDoc = await userRef.get();
      const userData = userDoc.data() as UserPackages | null;
      const omittedUserData = userData ? {
        createdAt: userData.createdAt,
        type: userData.type,
      } : null;
      await userRef.set({
        createdAt: FieldValue.serverTimestamp(),
        ...(userData && omittedUserData ? {history: userData.history?.push(omittedUserData) || [omittedUserData]} : {}),
        type: 'starterPack',
      });
      console.log(`Successfully fulfilled Near Starter Pack for ${accountId}.`);
    }
    if (eventType === 'checkout.session.expired' && accountId) {
      console.log(`Successfully expired Near Starter Pack for ${accountId}.`);
    }

    res.json({
      received: true,
    });
    res.status(200).end();
  } catch (error) {
    console.error(`[handleStripeEvents] Failed with '${error}'`);
    res.status(500).end();
  }
});
