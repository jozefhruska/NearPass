import React from "react";
import { Text, Button, Modal, Spacer, Input, Loading } from '@nextui-org/react';


export const EnterKeyPhrase = ({
  isKeyPhraseModalVisible,
  setKeyPhraseModalVisible,
  isFirstKeyPhraseEnter,
  isIncorrectPassPhrase,
  keyPhrase,
  setKeyPhrase,
  isDecyphering,
  setIsFirstKeyPhraseEnter,
}) => {
  return (
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
            disabled={ isDecyphering ||
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
            disabled={!keyPhrase || isIncorrectPassPhrase || isDecyphering}
            onPress={
              () => {
                setKeyPhraseModalVisible(false)
                setIsFirstKeyPhraseEnter(false)
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
