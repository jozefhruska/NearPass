import React from 'react';
import { AES, enc } from 'crypto-js';
import { Grid, Text, Input, Container, Button, Table } from "@nextui-org/react";
import PasswordCell from '../components/PasswordCell';

export default ({ helloNEAR, keyPhrase, wallet }) => {
  const [facebookPassword, setFacebookPassword] = React.useState('');
  const [contractResponse, setContractResponse] = React.useState('');
  const [contractResponseDeciphered, setContractResponseDeciphered] = React.useState();

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
/*

    <Container md>
      <Grid.Container gap={2} justify="center" md>
        <Grid xs={12}>
          <Text>
            Password is: {contractResponseDeciphered}
          </Text>
        </Grid>
        <Grid lg={12}>
          <Input.Password
            labelPlaceholder="Facebook password"
            onChange={({target: { value}}) => setFacebookPassword(value)}
            value={facebookPassword}
            status="default"
          />
        </Grid>
        <Grid lg={12}>
          <Button flat color="success" auto onPress={changeGreeting}>
            Save
          </Button>
        </Grid>
      </Grid.Container>
    </Container>
 */
