// React
import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import './assets/global.css';
import './assets/template.css';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { app } from './secrets';

// NEAR
import { NEARPasswordManager } from './near-interface';
import { Wallet } from './near-wallet';

const contractId = 'nearpass.near'
// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: contractId })

// Abstract the logic of interacting with the contract to simplify your flow
const PasswordManagerSC = new NEARPasswordManager({ contractId: contractId, walletToUse: wallet });

export const functions = getFunctions(app, 'europe-west1');

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()

  ReactDOM.render(
    <>
      <ToastContainer />
      <App isSignedIn={isSignedIn} PasswordManagerSC={PasswordManagerSC} wallet={wallet} />
    </>,
    document.getElementById('root')
  );
}
