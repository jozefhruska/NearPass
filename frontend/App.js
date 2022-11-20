import 'regenerator-runtime/runtime';
import React from 'react';

import Intro from './screens/Intro';
import PasswordManager from './screens/PasswordManager';
import NavBar from './components/NavBar';
import { useDebounce } from './helpers/hooks';
import { EnterKeyPhrase } from './components/modals/EnterKeyPhrase'
import { NotEnoughNear } from './components/modals/NotEnoughNear';
import { NextUIProvider } from '@nextui-org/react';


export default function App({ isSignedIn, PasswordManagerSC, wallet }) {
  const [isNotEnoughNearModalOpen, setIsNotEnoughNearModalOpen] = React.useState(false);
  const [hasEnoughFunds, setHasEnoughFunds] = React.useState(false);
  const [keyPhrase, setKeyPhrase] = React.useState('');
  const [isIncorrectPassPhrase, setIsIncorrectPassPhrase] = React.useState(false)
  const [shouldCheckPasswordStrength, setShouldCheckPasswordStrength] = React.useState(false)
  const [isKeyPhraseModalVisible, setKeyPhraseModalVisible] = React.useState(!keyPhrase && isSignedIn);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = React.useState(false);
  const [isDecrypting, setIsDecrypting] = React.useState(false);
  const [triggerDecrypting, setTriggerDecrypting] = React.useState(false);
  const debouncedKeyPhrase = useDebounce(keyPhrase, 50);

  return (
    <>
        {
          isSignedIn && (
            <NextUIProvider>
              <NavBar
                PasswordManagerSC={PasswordManagerSC}
                isSignedIn={isSignedIn}
                hasEnoughFunds={hasEnoughFunds}
                keyPhrase={debouncedKeyPhrase}
                openKeyPhraseModal={() => setKeyPhraseModalVisible(true)}
                wallet={wallet}
                setIsAddRecordModalOpen={setIsAddRecordModalOpen}
                setIsNotEnoughNearModalOpen={setIsNotEnoughNearModalOpen}
              />
              <PasswordManager
                closeKeyPhraseModal={() => setKeyPhraseModalVisible(false)}
                isAddRecordModalOpen={isAddRecordModalOpen}
                hasEnoughFunds={hasEnoughFunds}
                setHasEnoughFunds={setHasEnoughFunds}
                keyPhrase={debouncedKeyPhrase}
                PasswordManagerSC={PasswordManagerSC}
                setIsAddRecordModalOpen={setIsAddRecordModalOpen}
                setIsIncorrectPassPhrase={setIsIncorrectPassPhrase}
                setIsDecrypting={setIsDecrypting}
                setIsNotEnoughNearModalOpen={setIsNotEnoughNearModalOpen}
                triggerDecrypting={triggerDecrypting}
                setTriggerDecrypting={setTriggerDecrypting}
                setShouldCheckPasswordStrength={setShouldCheckPasswordStrength}
                wallet={wallet}
              />
              <NotEnoughNear
                isOpen={isNotEnoughNearModalOpen}
                setIsOpen={setIsNotEnoughNearModalOpen}
                userId={wallet.accountId}
              />
            </NextUIProvider>
          )
        }
        { isKeyPhraseModalVisible &&
          <EnterKeyPhrase
            shouldCheckPasswordStrength={shouldCheckPasswordStrength}
            isKeyPhraseModalVisible={isKeyPhraseModalVisible}
            setKeyPhraseModalVisible={setKeyPhraseModalVisible}
            isIncorrectPassPhrase={isIncorrectPassPhrase}
            keyPhrase={keyPhrase}
            isDecrypting={isDecrypting}
            setKeyPhrase={setKeyPhrase}
            setTriggerDecrypting={setTriggerDecrypting}
            wallet={wallet}
          />
        }
      {
        !isSignedIn && (
          <Intro
            onLoginPress={() => wallet.signIn() && setKeyPhraseModalVisible(true)}
            wallet={wallet}
          />
        )
      }
    </>
  )
}
