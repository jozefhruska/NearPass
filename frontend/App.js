import 'regenerator-runtime/runtime';
import React from 'react';
import { Button, Spacer, Text, Modal, Input } from '@nextui-org/react';

import Intro from './screens/Intro';
import PasswordManager from './screens/PasswordManager';
import NavBar from './components/NavBar';


export default function App({ isSignedIn, PasswordManagerSC, wallet }) {
  const [keyPhrase, setKeyPhrase] = React.useState('');
  const [isIncorrectPassPhrase, setIsIncorrectPassPhrase] = React.useState(false)
  const [isKeyPhraseModalVisible, setKeyPhraseModalVisible] = React.useState(!keyPhrase && isSignedIn);
  const [isFirstKeyPhraseEnter, setIsFirstKeyPhraseEnter] = React.useState(!keyPhrase);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = React.useState(false);
  return (
    <>
      <NavBar
        PasswordManagerSC={PasswordManagerSC}
        isSignedIn={isSignedIn}
        keyPhrase={keyPhrase}
        openKeyPhraseModal={() => setKeyPhraseModalVisible(true)}
        wallet={wallet}
        setIsAddRecordModalOpen={setIsAddRecordModalOpen}
      />
      {
        isSignedIn
          ? (
            <PasswordManager
              isAddRecordModalOpen={isAddRecordModalOpen}
              keyPhrase={keyPhrase}
              PasswordManagerSC={PasswordManagerSC}
              setIsAddRecordModalOpen={setIsAddRecordModalOpen}
              setIsIncorrectPassPhrase={setIsIncorrectPassPhrase}
              wallet={wallet}
            />
          )
          : <Intro wallet={wallet} />
      }
      { isKeyPhraseModalVisible &&
        <Modal
          aria-labelledby="Enter passphrase"
          blur
          open={isKeyPhraseModalVisible}
          onClose={() => setKeyPhraseModalVisible(false)}
          preventClose={isFirstKeyPhraseEnter || isIncorrectPassPhrase}
        >
          <Modal.Header>
            {
              isFirstKeyPhraseEnter && <Spacer y={3}/>
            }
            <Text id="modal-title" size={18}>
              {isFirstKeyPhraseEnter ? 'Enter' : 'Change'} your passphrase
            </Text>
          </Modal.Header>
          <form onSubmit={
            (e) => {
              e.preventDefault()
              setKeyPhraseModalVisible(false)
              setIsFirstKeyPhraseEnter(false)
            }}>
            <Modal.Body>
              <Spacer y={0}/>
              <Input.Password
                bordered
                clearable
                color="primary"
                labelPlaceholder="Passphrase"
                fullWidth
                onChange={({target: {value}}) => setKeyPhrase(value)}
                placeholder="Password"
                value={keyPhrase}
                size="lg"
                helperColor="error"
                helperText={keyPhrase && isIncorrectPassPhrase ? 'Incorrect passphrase' : ''}
              />
              <Spacer y={0}/>
            </Modal.Body>
            <Modal.Footer justify="center">
              <Button
                auto
                disabled={
                  isFirstKeyPhraseEnter
                    ? false
                    : !keyPhrase || isIncorrectPassPhrase
                }
                flat
                onPress={() =>
                  isFirstKeyPhraseEnter
                    ? wallet.signOut()
                    : setKeyPhraseModalVisible(false)
                }>
                {
                  isFirstKeyPhraseEnter
                    ? 'Sign out'
                    : 'Close'
                }
              </Button>
              <Button
                auto
                disabled={!keyPhrase || isIncorrectPassPhrase}
                onPress={
                  () => {
                    setKeyPhraseModalVisible(false)
                    setIsFirstKeyPhraseEnter(false)
                  }
                }
                type="submit">
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      }
    </>
  )
}
