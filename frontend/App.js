import 'regenerator-runtime/runtime';
import React from 'react';

import Intro from './screens/Intro';
import PasswordManager from './screens/PasswordManager';
import NavBar from './components/NavBar';


export default function App({ isSignedIn, helloNEAR, wallet }) {
  return (
    <>
      <NavBar isSignedIn={isSignedIn} wallet={wallet} />
      {
        isSignedIn
          ? <PasswordManager wallet={wallet} helloNEAR={helloNEAR} />
          : <Intro wallet={wallet} />
      }
    </>
  )
}
