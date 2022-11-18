import 'regenerator-runtime/runtime';
import React from 'react';

import Intro from './screens/Intro';
import PasswordManager from './screens/PasswordManager';
import NavBar from './components/NavBar';
import { useDebounce } from './helpers/hooks';
import { EnterKeyPhrase } from './components/modals/EnterKeyPhrase'


export default function App({ isSignedIn, PasswordManagerSC, wallet }) {
  const [keyPhrase, setKeyPhrase] = React.useState('');
  const [isIncorrectPassPhrase, setIsIncorrectPassPhrase] = React.useState(false)
  const [isKeyPhraseModalVisible, setKeyPhraseModalVisible] = React.useState(!keyPhrase && isSignedIn);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = React.useState(false);
  const [isDecrypting, setIsDecrypting] = React.useState(false);
  const [triggerDecrypting, setTriggerDecrypting] = React.useState(false);
  const debouncedKeyPhrase = useDebounce(keyPhrase, 50);
  return (
    <>
      <NavBar
        PasswordManagerSC={PasswordManagerSC}
        isSignedIn={isSignedIn}
        keyPhrase={debouncedKeyPhrase}
        openKeyPhraseModal={() => setKeyPhraseModalVisible(true)}
        wallet={wallet}
        setIsAddRecordModalOpen={setIsAddRecordModalOpen}
      />
      {
        isSignedIn
          ? (
            <PasswordManager
              closeKeyPhraseModal={() => setKeyPhraseModalVisible(false)}
              isAddRecordModalOpen={isAddRecordModalOpen}
              keyPhrase={debouncedKeyPhrase}
              PasswordManagerSC={PasswordManagerSC}
              setIsAddRecordModalOpen={setIsAddRecordModalOpen}
              setIsIncorrectPassPhrase={setIsIncorrectPassPhrase}
              setIsDecrypting={setIsDecrypting}
              triggerDecrypting={triggerDecrypting}
              setTriggerDecrypting={setTriggerDecrypting}
              wallet={wallet}
            />
          )
          : <Intro wallet={wallet} />
      }
      { isKeyPhraseModalVisible &&
        <EnterKeyPhrase
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
    </>
  )
}
