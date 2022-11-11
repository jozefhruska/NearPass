import React from "react";
import { Text, Button, Modal, Spacer, Input } from '@nextui-org/react';
import { AES } from 'crypto-js';
import { toast } from 'react-toastify';

export const AddRecord = ({ isOpen, setIsOpen, PasswordManagerSC, keyPhrase }) => {
  const [passwordName, setPasswordName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [link, setLink] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const addRecord = () => {
    if (!password) {
      toast.warn('Password field is mandatory')
      return false
    }
    if (!passwordName) {
      toast.warn('Password name field is mandatory')
      return false
    }
    setIsLoading(true);
    const encryptedPassword = AES.encrypt(password, keyPhrase).toString();
    const encryptedLink = AES.encrypt(link, keyPhrase).toString();
    const encryptedPasswordName = AES.encrypt(passwordName, keyPhrase).toString();
    const encryptedUsername = AES.encrypt(username, keyPhrase).toString();
    PasswordManagerSC.setPasswordRecord({
      ...(link ? { link: encryptedLink } : {}),
      ...(username ? { username: encryptedUsername } : {}),
      password: encryptedPassword,
      passwordName: encryptedPasswordName,
    }).finally(() => {
        setIsLoading(false);
      });
    return true
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
            onPress={() => {
              const responseStatus = addRecord();
              if (responseStatus) {
                setIsOpen(false);
              }
            }}
            type="submit">
            Save
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
