import React from 'react';
import { AES, enc } from 'crypto-js';
import { Container, Table, Text } from '@nextui-org/react';
import PasswordCell from '../components/PasswordCell';
import { AddRecord } from '../components/modals/AddRecord';
import { firestoreHttpsCallable } from '../helpers/util';

export default ({
  PasswordManagerSC,
  keyPhrase,
  wallet,
  isAddRecordModalOpen,
  setIsIncorrectPassPhrase,
  setIsAddRecordModalOpen,
  setIsDecyphering,
}) => {
  const [contractResponse, setContractResponse] = React.useState([]);
  const [decryptedContractResponse, setDecryptedContractResponse] = React.useState([]);
  const [activeRecord, setActiveRecord] = React.useState(null);
  const decipherAndSetText = async (passwordRecords) => {
    setIsDecyphering(true)
    let didFail = false;
    let wasOnePasswordCorrect = false;
    const decryptedPasswordRecords = await Promise.all((passwordRecords || contractResponse).map(async (encryptedPasswordRecord, id) => {
      try {
        const responseDecrypt = await firestoreHttpsCallable('secondRoundDecrypt', {
          passwordRecord: encryptedPasswordRecord,
          userId: wallet?.accountId,
        })
        const decryptedPasswordRecord = responseDecrypt?.data?.passwordRecord
        const decryptedFirstRound = {
          index: decryptedPasswordRecord.index,
          link: decryptedPasswordRecord.link
            ? AES.decrypt(decryptedPasswordRecord.link, keyPhrase).toString(enc.Utf8)
            : '',
          username: decryptedPasswordRecord.username
            ? AES.decrypt(decryptedPasswordRecord.username, keyPhrase).toString(enc.Utf8)
            : '',
          password: AES.decrypt(decryptedPasswordRecord.password, keyPhrase).toString(enc.Utf8),
          passwordName: AES.decrypt(decryptedPasswordRecord.passwordName, keyPhrase).toString(enc.Utf8),
        }
        if (decryptedFirstRound.passwordName && decryptedFirstRound.password) {
          wasOnePasswordCorrect = true
          return ({
            id,
            ...decryptedFirstRound,
          })
        }
      } catch(e) {
        didFail = true
      }
    }))
    if (!didFail) {
      setDecryptedContractResponse(decryptedPasswordRecords)
    }
    setIsIncorrectPassPhrase(!wasOnePasswordCorrect)
    setIsDecyphering(false)
  }

  const getPasswordRecords = async () => {
    const passwordRecords = await PasswordManagerSC.getPasswordRecord(wallet?.accountId)
    setContractResponse(passwordRecords)
    await decipherAndSetText(passwordRecords)
  }

  React.useEffect(() => {
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
                    PasswordManagerSC={PasswordManagerSC}
                    getPasswordRecords={getPasswordRecords}
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
          getPasswordRecords={getPasswordRecords}
          isOpen={isAddRecordModalOpen}
          keyPhrase={keyPhrase}
          editingRecord={activeRecord}
          wallet={wallet}
        />
      }
    </Container>
  )
}
