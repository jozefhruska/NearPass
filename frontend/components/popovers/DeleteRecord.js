import React from "react";
import { Text, Button, Grid, Row, Loading } from '@nextui-org/react';

export const DeleteRecord = ({ closePopover, getPasswordRecords, index, PasswordManagerSC }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Grid.Container
      css={{borderRadius: '14px', padding: '0.75rem', maxWidth: '330px'}}
    >
      <Row justify="center" align="center">
        <Text b>Confirm</Text>
      </Row>
      <Row>
        <Text>
          Are you sure you want to delete this password & related metadata? You will
          not be able to recover this data!
        </Text>
      </Row>
      <Grid.Container justify="space-between" alignContent="center">
        <Grid>
          <Button
            disabled={isLoading}
            light
            onPress={closePopover}
            size="sm">
            Cancel
          </Button>
        </Grid>
        <Grid>
          <Button
            size="sm"
            shadow color="error"
            disabled={isLoading}
            onPress={
              async () => {
                setIsLoading(true)
                await PasswordManagerSC.deletePasswordRecord({index});
                await getPasswordRecords()
                setIsLoading(false)
                closePopover()
              }
          }>
            {
              isLoading
                ? (
                  <Loading color="currentColor" type="points" />
                )
                : 'Delete'
            }
          </Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
