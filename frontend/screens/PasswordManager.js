import React from 'react';
import { AES, enc } from 'crypto-js';
import { Container, Table } from '@nextui-org/react';
import PasswordCell from '../components/PasswordCell';

export default ({ PasswordManagerSC, keyPhrase, wallet, ...restProps }) => {
  const [contractResponse, setContractResponse] = React.useState([]);
  const [decryptedContractResponse, setDecryptedContractResponse] = React.useState([]);
  const [isIncorrectPassPhrase, setIsIncorrectPassPhrase] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const decipherAndSetText = (passwordRecords) => {
    let didFail = false
    const decryptedPasswordRecords = (passwordRecords || contractResponse).map(({
      link,
      passwordName,
      password,
      username,
    }, index) => {
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
          return ({
            id: index,
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
  const changeGreeting = (e) => {
  }
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
                    openEditModal={() => setIsEditModalOpen(true)}
                  />
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}
