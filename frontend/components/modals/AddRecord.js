import React from "react";
import { Text, Button, Modal, Spacer, Input, Loading } from '@nextui-org/react';
import { AES } from 'crypto-js';
import { toast } from 'react-toastify';

export const AddRecord = ({ isOpen, setIsOpen, PasswordManagerSC, keyPhrase, editingRecord }) => {
  const [passwordName, setPasswordName] = React.useState(
    editingRecord?.passwordName || ''
  );
  const [password, setPassword] = React.useState(editingRecord?.password || '');
  const [username, setUsername] = React.useState(editingRecord?.username || '');
  const [link, setLink] = React.useState(editingRecord?.link || '');
  const [isLoading, setIsLoading] = React.useState(false);

  const addRecord = async() => {
    if (!password) {
      toast.warn('Password field is mandatory')
      return false
    }
    if (!passwordName) {
      toast.warn('Password name field is mandatory')
      return false
    }
    setIsLoading(true);
    try {
      const encryptedPassword = AES.encrypt(password, keyPhrase).toString();
      const encryptedLink = AES.encrypt(link, keyPhrase).toString();
      const encryptedPasswordName = AES.encrypt(passwordName, keyPhrase).toString();
      const encryptedUsername = AES.encrypt(username, keyPhrase).toString();
      await PasswordManagerSC.setPasswordRecord({
        ...(link ? {link: encryptedLink} : {}),
        ...(username ? {username: encryptedUsername} : {}),
        password: encryptedPassword,
        passwordName: encryptedPasswordName,
        ...(editingRecord ? {index: editingRecord.index} : {}),
      })
      setIsLoading(false);
      return true
    } catch (e) {
      toast.error('Unable to save your password, try again later.')
      setIsLoading(false);
      return false
    }
  }
  return (
    <Modal
      aria-labelledby="Add record"
      closeButton
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Add new password record
        </Text>
      </Modal.Header>
      <form onSubmit={
        (e) => {
          e.preventDefault();
        }}>
        <Modal.Body>
          <Spacer y={0}/>
          <Input
            bordered
            clearable
            color="primary"
            labelPlaceholder="Password name*"
            fullWidth
            onChange={({target: {value}}) => setPasswordName(value)}
            placeholder="Password name"
            value={passwordName}
            size="lg"
          />
          <Spacer y={0}/>
          <Input
            bordered
            clearable
            color="primary"
            labelPlaceholder="Username"
            fullWidth
            onChange={({target: {value}}) => setUsername(value)}
            placeholder="Username"
            value={username}
            size="lg"
          />
          <Spacer y={0}/>
          <Input.Password
            bordered
            clearable
            color="primary"
            labelPlaceholder="Password*"
            fullWidth
            onChange={({target: {value}}) => setPassword(value)}
            placeholder="Password"
            value={password}
            size="lg"
          />
          <Spacer y={0}/>
          <Input
            bordered
            clearable
            color="primary"
            labelPlaceholder="Website (link)"
            fullWidth
            onChange={({target: {value}}) => setLink(value)}
            placeholder="Website"
            value={link}
            size="lg"
          />
        </Modal.Body>
        <Modal.Footer justify="center">
          <Button
            auto
            flat
            onPress={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            auto
            disabled={isLoading}
            onPress={() => {
              const responseStatus = addRecord();
              if (responseStatus) {
                setIsOpen(false);
              }
            }}
            type="submit">
            {
              isLoading
                ? (
                  <Loading color="currentColor" />
                )
                : 'Save'
            }
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};