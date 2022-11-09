import React from "react";
import { Text, Button, Grid, Row } from "@nextui-org/react";

export const DeleteUser = ({ closePopover }) => (
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
        <Button size="sm" light onPress={closePopover}>
          Cancel
        </Button>
      </Grid>
      <Grid>
        <Button size="sm" shadow color="error">
          Delete
        </Button>
      </Grid>
    </Grid.Container>
  </Grid.Container>
);
