import React from "react";
import { Text, Button, Modal, Spacer, Input, Loading } from '@nextui-org/react';


export const EnterKeyPhrase = ({
  isKeyPhraseModalVisible,
  setKeyPhraseModalVisible,
  isIncorrectPassPhrase,
  keyPhrase,
  setKeyPhrase,
  isDecyphering,
  setTriggerDecyphering,
  wallet,
}) => {
  return (
    <Modal
      aria-labelledby="Enter passphrase"
      blur
      open={isKeyPhraseModalVisible}
      onClose={() => setKeyPhraseModalVisible(false)}
      preventClose
    >
      <Modal.Header>
        <Spacer y={2} />
        <Text id="modal-title" size={18}>
          Enter your passphrase
        </Text>
      </Modal.Header>
      <form onSubmit={
        (e) => {
          e.preventDefault()
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
            disabled={isDecyphering}
            flat
            onPress={wallet.signOut}>
              Sign out
          </Button>
          <Button
            auto
            disabled={!keyPhrase || isDecyphering}
            onPress={
              () => {
                setTriggerDecyphering(true)
              }
            }
            type="submit">
            {
              isDecyphering && keyPhrase
                ? (
                  <Loading color="currentColor" type="points" />
                )
                : 'Enter'
            }
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
};
