import React from "react";
import { Text, Button, Modal, Spacer, Input, Loading } from '@nextui-org/react';
import { AES } from 'crypto-js';
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
    .max(32, 'Please shorten the website\'s URL.')
    .matches('^(http:\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$', 'Invalid URL')
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
      const encryptedLink = AES.encrypt(`https://${link}`, keyPhrase).toString();
      const encryptedPasswordName = AES.encrypt(passwordName, keyPhrase).toString();
      const encryptedUsername = AES.encrypt(username, keyPhrase).toString();
      const firstRoundEncryptedPasswordRecord = {
        link: encryptedLink,
        username: encryptedUsername,
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
      link: editingRecord?.link?.replace('https://', '') || '',
    },
    onSubmit: values => addRecord(values),
    validationSchema: RecordSchema,
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
          <Input
            id="passwordName"
            name="passwordName"
            bordered
            clearable
            color="primary"
            label="Password name"
            fullWidth
            onChange={formik.handleChange}
            placeholder="Password name"
            value={formik.values.passwordName}
            size="lg"
            helperColor="error"
            helperText={formik.errors.passwordName}
            onBlur={formik.handleBlur}
          />
          <Input
            id="username"
            name="username"
            bordered
            clearable
            color="primary"
            label="Username"
            fullWidth
            onChange={formik.handleChange}
            placeholder="Username"
            value={formik.values.username}
            size="lg"
            helperColor="error"
            helperText={formik.errors.username}
            onBlur={formik.handleBlur}
          />
          <Input.Password
            id="password"
            name="password"
            bordered
            clearable
            color="primary"
            label="Password"
            fullWidth
            onChange={formik.handleChange}
            placeholder="Password"
            value={formik.values.password}
            size="lg"
            helperColor="error"
            helperText={formik.errors.password}
            onBlur={formik.handleBlur}
          />
          <Input
            labelLeft="https://"
            id="link"
            name="link"
            bordered
            clearable
            color="primary"
            label="Website (link)"
            fullWidth
            onChange={formik.handleChange}
            placeholder="www.example.com"
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
