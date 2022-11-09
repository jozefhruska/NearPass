import React from 'react';
import { AES, enc } from 'crypto-js';
import { Grid, Text, Input, Container, Button } from "@nextui-org/react";

export default ({ helloNEAR, wallet }) => {
  const [facebookPassword, setFacebookPassword] = React.useState('');
  const [contractResponse, setContractResponse] = React.useState();
  const [keyPhrase, setKeyPhrase] = React.useState('keyphrase');

  const [isLoading, setIsLoading] = React.useState(true);
  const decipherAndSetText = (response) => {
    const bytes = AES.decrypt(response, keyPhrase);
    const decipheredText = bytes.toString(enc.Utf8);
    setContractResponse(decipheredText || 'Incorrect passphrase')
    if (decipheredText) {
      setFacebookPassword(decipheredText)
    }
  }
  // Get blockchain state once on component load
  React.useEffect(() => {
    helloNEAR.getGreeting()
      .then(decipherAndSetText)
      .catch(alert)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function changeGreeting(e) {
    setIsLoading(true);
    const cipheredText = AES.encrypt(facebookPassword, keyPhrase).toString()
    helloNEAR.setGreeting(cipheredText)
      .then(async () => {return helloNEAR.getGreeting();})
      .then(decipherAndSetText)
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <Container md>
      <Grid.Container gap={2} justify="center" md>
        <Grid xs={12}>
          <Text>
            Password is: {contractResponse}
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
          <Input.Password
            labelPlaceholder="Keyphrase"
            onChange={({target: { value}}) => setKeyPhrase(value)}
            value={keyPhrase}
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
  )
}
