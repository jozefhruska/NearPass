import React from 'react';
import { AES, enc } from 'crypto-js';
import { Grid, Text, Input, Container, Button, Table, Modal, Spacer } from '@nextui-org/react';
import PasswordCell from '../components/PasswordCell';

export default ({ helloNEAR, keyPhrase, wallet }) => {
  const [facebookPassword, setFacebookPassword] = React.useState('');
  const [contractResponse, setContractResponse] = React.useState('');
  const [contractResponseDeciphered, setContractResponseDeciphered] = React.useState();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);
  const decipherAndSetText = (response) => {
    const bytes = AES.decrypt(response || contractResponse, keyPhrase);
    try {
      const decipheredText = bytes.toString(enc.Utf8);
      setContractResponseDeciphered(decipheredText || 'Incorrect passphrase')
      if (decipheredText) {
        setFacebookPassword(decipheredText)
      }
    } catch(e) {
      // Sometimes when entering wrong password too quickly we get Malformed UTF-8 data error
      console.warn('error', e)
      setContractResponseDeciphered('Incorrect passphrase')

    }
  }
  // Get blockchain state once on component load
  React.useEffect(() => {
    helloNEAR.getGreeting()
      .then((response) => {
        setContractResponse(response)
        return response
      })
      .then(decipherAndSetText)
      .catch(alert)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const changeGreeting = (e) => {
    setIsLoading(true);
    const cipheredText = AES.encrypt(facebookPassword, keyPhrase).toString()
    helloNEAR.setGreeting(cipheredText)
      .then(async () => {return helloNEAR.getGreeting();})
      .then(decipherAndSetText)
      .finally(() => {
        setIsLoading(false);
      });
  }
  React.useEffect(() => {
    decipherAndSetText()
  }, [keyPhrase])
  const columns = [
    { name: "PASSWORD NAME", uid: "name" },
    { name: "WEBSITE", uid: "link" },
    { name: "ACTIONS", uid: "actions" },
  ]

  const records = [
    {
      id: 1,
      name: "Facebook",
      link: "https://www.facebook.com/",
      username: "Wakawaka",
      password: contractResponseDeciphered,
    },
  ];
  return (
    <Container md>
      <Table
        aria-label="Password overview table"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        selectionMode="none"
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={records}>
          {(record) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>
                  <PasswordCell
                    record={record}
                    columnKey={columnKey}
                    openEditModal={() => setIsEditModalOpen(true)}
                  />
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <Modal
        aria-labelledby="Edit record"
        closeButton
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Edit your record data
          </Text>
        </Modal.Header>
        <form onSubmit={
          (e) => {
            e.preventDefault()
            setIsEditModalOpen(false)
          }}>
          <Modal.Body>
            <Spacer y={0}/>
            <Input.Password
              bordered
              clearable
              color="primary"
              labelPlaceholder="Password"
              fullWidth
              onChange={({target: {value}}) => setFacebookPassword(value)}
              placeholder="Password"
              value={facebookPassword}
              size="lg"
            />
          </Modal.Body>
          <Modal.Footer justify="center">
            <Button
              auto
              flat
              onPress={() => setIsEditModalOpen(false)}>
              Close
            </Button>
            <Button
              auto
              disabled={!keyPhrase}
              onPress={() => {
                changeGreeting()
                setIsEditModalOpen(false)
              }}
              type="submit">
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Container>
  )
}
