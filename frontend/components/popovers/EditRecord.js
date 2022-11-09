import React from "react";
import { Text, Button, Grid, Row, Input} from "@nextui-org/react";

export const EditRecord = ({ closePopover, password, setPassword }) => (
  <Grid.Container
    css={{borderRadius: '14px', padding: '0.75rem', maxWidth: '330px'}}
  >
    <Row justify="center" align="center">
      <Text b>Confirm</Text>
    </Row>
    <Grid xs={12} css={{ py: "$4" }}>
      <Input.Password
        labelPlaceholder="Facebook password"
        onChange={({target: { value}}) => setPassword(value)}
        value={password}
        status="default"
      />
    </Grid>
    <Grid xs={12} css={{ py: "$4" }}>
      <Input.Password
        labelPlaceholder="Facebook password"
        onChange={({target: { value}}) => setPassword(value)}
        value={password}
        status="default"
      />
    </Grid>
    <Grid xs={12} css={{ py: "$4" }}>
      <Input.Password
        labelPlaceholder="Facebook password"
        onChange={({target: { value}}) => setPassword(value)}
        value={password}
        status="default"
      />
    </Grid>
    <Grid xs={12} css={{ py: "$4" }}>
      <Input.Password
        labelPlaceholder="Facebook password"
        onChange={({target: { value}}) => setPassword(value)}
        value={password}
        status="default"
      />
    </Grid>
    <Grid.Container justify="space-between" alignContent="center">
      <Grid>
        <Button size="sm" light onPress={closePopover}>
          Cancel
        </Button>
      </Grid>
      <Grid>
        <Button size="sm" shadow color="success">
          Save
        </Button>
      </Grid>
    </Grid.Container>
  </Grid.Container>
);
