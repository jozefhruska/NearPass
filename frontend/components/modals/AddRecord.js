import React from "react";
import { Text, Button, Modal, Spacer, Input, Loading } from '@nextui-org/react';
import { AES, enc } from 'crypto-js';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { firestoreHttpsCallable } from '../../helpers/util';

const RecordSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Username is too short')
    .max(24, 'Username is too long')
    .required('This field is mandatory'),
  link: Yup.string()
    .url('Invalid URL')
    .required('This field is mandatory'),
  passwordName: Yup.string()
    .min(4, 'Password name is too short')
    .max(24, 'Password name is too long')
    .required('This field is mandatory'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(24, 'Password can be maximum 24 characters')
    .required('This field is mandatory')
})

export const AddRecord = ({
  isOpen,
  getPasswordRecords,
  setIsOpen,
  PasswordManagerSC,
  keyPhrase,
  editingRecord,
  wallet,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const addRecord = async({ password, link, passwordName, username }) => {
    setIsLoading(true);
    try {
      const encryptedPassword = AES.encrypt(password, keyPhrase).toString();
      const encryptedLink = AES.encrypt(link, keyPhrase).toString();
      const encryptedPasswordName = AES.encrypt(passwordName, keyPhrase).toString();
      const encryptedUsername = AES.encrypt(username, keyPhrase).toString();
      const firstRoundEncryptedPasswordRecord = {
        ...(link ? {link: encryptedLink} : {}),
        ...(username ? {username: encryptedUsername} : {}),
        password: encryptedPassword,
        passwordName: encryptedPasswordName,
        ...(editingRecord ? {index: editingRecord.index} : {})
      }
      const response = await firestoreHttpsCallable('secondRoundEncrypt', {
        passwordRecord: firstRoundEncryptedPasswordRecord,
        userId: wallet?.accountId,
      })
      const encryptedPasswordRecord = response?.data?.passwordRecord
      await PasswordManagerSC.setPasswordRecord(encryptedPasswordRecord)
      await getPasswordRecords()
      setIsOpen(false);
      setIsLoading(false);
      toast.success(`Password ${editingRecord ? 'edited' : 'saved'} successfully 🎉`)
      return true
    } catch (e) {
      toast.error('Unable to save your password, try again later.')
      setIsLoading(false);
      return false
    }
  }

  const formik = useFormik({
    initialValues: {
      passwordName: editingRecord?.passwordName || '',
      password: editingRecord?.password || '',
      username: editingRecord?.username || '',
      link: editingRecord?.link || '',
    },
    onSubmit: values => addRecord(values),
    validationSchema: RecordSchema,
    validateOnBlur: true,
  });
  return (
    <Modal
      aria-labelledby="Add record"
      closeButton={!isLoading}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      preventClose={isLoading}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Add new password record
        </Text>
      </Modal.Header>
      <form onSubmit={
        (e) => {
          e.preventDefault();
          formik.handleSubmit()
        }}>
        <Modal.Body>
          <Spacer y={1}/>
          <Input
            id="passwordName"
            name="passwordName"
            bordered
            clearable
            color="primary"
            labelPlaceholder="Password name*"
            fullWidth
            onChange={formik.handleChange}
            placeholder="Password name"
            value={formik.values.passwordName}
            size="lg"
            helperColor="error"
            helperText={formik.errors.passwordName}
            onBlur={formik.handleBlur}
          />
          <Spacer y={1}/>
          <Input
            id="username"
            name="username"
            bordered
            clearable
            color="primary"
            labelPlaceholder="Username"
            fullWidth
            onChange={formik.handleChange}
            placeholder="Username"
            value={formik.values.username}
            size="lg"
            helperColor="error"
            helperText={formik.errors.username}
            onBlur={formik.handleBlur}
          />
          <Spacer y={1}/>
          <Input.Password
            id="password"
            name="password"
            bordered
            clearable
            color="primary"
            labelPlaceholder="Password*"
            fullWidth
            onChange={formik.handleChange}
            placeholder="Password"
            value={formik.values.password}
            size="lg"
            helperColor="error"
            helperText={formik.errors.password}
            onBlur={formik.handleBlur}
          />
          <Spacer y={1}/>
          <Input
            id="link"
            name="link"
            bordered
            clearable
            color="primary"
            labelPlaceholder="Website (link)"
            fullWidth
            onChange={formik.handleChange}
            placeholder="Website"
            value={formik.values.link}
            helperColor="error"
            helperText={formik.errors.link}
            size="lg"
            onBlur={formik.handleBlur}
          />
          <Spacer y={0}/>
        </Modal.Body>
        <Modal.Footer justify="center">
          <Button
            auto
            flat
            disabled={isLoading}
            onPress={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            auto
            disabled={isLoading || Object.values(formik.errors).length}
            type="submit">
            {
              isLoading
                ? (
                  <Loading color="currentColor" type="points" />
                )
                : 'Save'
            }
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
