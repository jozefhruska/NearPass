import React from 'react';
import { AES, enc } from 'crypto-js';
import { Container, Table, Text } from '@nextui-org/react';
import PasswordCell from '../components/PasswordCell';
import { AddRecord } from '../components/modals/AddRecord';

export default ({
  PasswordManagerSC,
  keyPhrase,
  wallet,
  isAddRecordModalOpen,
  setIsAddRecordModalOpen,
}) => {
  const [contractResponse, setContractResponse] = React.useState([]);
  const [decryptedContractResponse, setDecryptedContractResponse] = React.useState([]);
  const [isIncorrectPassPhrase, setIsIncorrectPassPhrase] = React.useState(false)
  const [activeRecord, setActiveRecord] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const decipherAndSetText = (passwordRecords) => {
    let didFail = false
    const decryptedPasswordRecords = (passwordRecords || contractResponse).map(({
      index,
      link,
      passwordName,
      password,
      username,
    }, id) => {
      const passwordNameBytes = AES.decrypt(passwordName, keyPhrase);
      const passwordBytes = AES.decrypt(password, keyPhrase);
      const usernameBytes = username ? AES.decrypt(username, keyPhrase) : '';
      const linkBytes = link ? AES.decrypt(link, keyPhrase) : '';
      try {
        const decryptedPasswordName = passwordNameBytes.toString(enc.Utf8);
        const decryptedPassword = passwordBytes.toString(enc.Utf8);
        const decryptedUsername = usernameBytes ? usernameBytes.toString(enc.Utf8) : '';
        const decryptedLink = linkBytes ? linkBytes.toString(enc.Utf8) : '';
        if (decryptedPasswordName && decryptedPassword) {
          setIsIncorrectPassPhrase(false)
          return ({
            id,
            index,
            passwordName: decryptedPasswordName,
            password: decryptedPassword,
            username: decryptedUsername,
            link: decryptedLink,
          })
        } else {
          setIsIncorrectPassPhrase(true)
        }
      } catch(e) {
        // Sometimes when entering wrong password too quickly we get Malformed UTF-8 data error
        setIsIncorrectPassPhrase(true)
        didFail = true
      }
    })
    if (!didFail) {
      setDecryptedContractResponse(decryptedPasswordRecords)
    }
  }
  React.useEffect(() => {
    const getPasswordRecords = async () => {
      const passwordRecords = await PasswordManagerSC.getPasswordRecord(wallet?.accountId)
      setContractResponse(passwordRecords)
      decipherAndSetText(passwordRecords)
    }
    getPasswordRecords()
  }, [])
  React.useEffect(() => {
    decipherAndSetText()
  }, [keyPhrase])
  const columns = [
    { name: "PASSWORD NAME", uid: "passwordName" },
    { name: "WEBSITE", uid: "link" },
    { name: "ACTIONS", uid: "actions" },
  ]
  if (isIncorrectPassPhrase) {
    return (
      <Container md>
        <Text>
          Please enter correct passphrase
        </Text>
      </Container>
    )
  }
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
        <Table.Body items={decryptedContractResponse}>
          {(record) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>
                  <PasswordCell
                    record={record}
                    columnKey={columnKey}
                    openEditModal={(record) => {
                      setActiveRecord(record)
                      setIsAddRecordModalOpen(true)
                    }}
                  />
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      { isAddRecordModalOpen &&
        <AddRecord
          PasswordManagerSC={PasswordManagerSC}
          setIsOpen={(value) => {
            // If value is false (modal is closing), reset active record
            if (!value) {
              setActiveRecord(null)
              setIsAddRecordModalOpen(value)
            }
          }}
          isOpen={isAddRecordModalOpen}
          keyPhrase={keyPhrase}
          editingRecord={activeRecord}
        />
      }
    </Container>
  )
}
