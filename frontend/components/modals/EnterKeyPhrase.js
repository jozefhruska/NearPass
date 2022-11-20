import React from "react";
import { Text, Button, Modal, Spacer, Input, Loading, Progress } from '@nextui-org/react';

const getPasswordStrength = (keyPhrase) => {
  const strongestPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{14,})');
  const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})');
  const mediumPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})');
  const weakPassword = new RegExp('((?=.*[a-z])|(?=.*[A-Z]))(?=.*[0-9])(?=.{8,})');
  if (strongestPassword.test(keyPhrase)) {
    return {
      color: 'success',
      progress: 100,
      title: 'Excellent password!',
    };
  }
  if (strongPassword.test(keyPhrase)) {
    return {
      color: 'success',
      progress: 75,
      title: 'Very good password',
    };
  }
  if (mediumPassword.test(keyPhrase)) {
    return {
      color: 'secondary',
      progress: 50,
      title: 'So-so password',
    };
  }
  if (weakPassword.test(keyPhrase)) {
    return {
      color: 'warning',
      progress: 25,
      title: 'Weak password',
    };
  }
  return {
    color: 'error',
    progress: 0,
    title: 'Too weak password',
  };
}
export const EnterKeyPhrase = ({
  isKeyPhraseModalVisible,
  setKeyPhraseModalVisible,
  isIncorrectPassPhrase,
  keyPhrase,
  setKeyPhrase,
  isDecrypting,
  setTriggerDecrypting,
  shouldCheckPasswordStrength,
  wallet,
}) => {
  const passwordStrength = getPasswordStrength(keyPhrase);
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
            helperText={
              isIncorrectPassPhrase
                ? 'Incorrect passphrase'
                : ''
            }
          />
          { shouldCheckPasswordStrength &&
            <Text>
              <Progress value={passwordStrength.progress} color={passwordStrength.color} size="sm"/>
              {passwordStrength.title}
            </Text>
          }
          <Spacer y={0}/>
        </Modal.Body>
        <Modal.Footer justify="center">
          <Button
            auto
            disabled={isDecrypting}
            flat
            onPress={wallet.signOut}>
              Sign out
          </Button>
          <Button
            auto
            disabled={!keyPhrase || isDecrypting || (shouldCheckPasswordStrength && passwordStrength.progress === 0)}
            onPress={
              () => {
                setTriggerDecrypting(true)
              }
            }
            type="submit">
            {
              isDecrypting && keyPhrase
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
