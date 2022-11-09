import React from "react";
import { Text, Button, Grid, Row, Link, Card } from "@nextui-org/react";

export const ViewRecord = ({ closePopover, record }) => (
  <Card css={{ p: "$6", mw: "400px" }}>
    <Card.Header>
    </Card.Header>
    <Card.Body css={{ py: "$2" }}>
      <Grid.Container>
        <Grid xs={12}>
          <Text h4 css={{ lineHeight: "$xs" }}>
            {
              record.link
                ? (
                  <Link href={record.link} isExternal target="_blank">
                    {record.name}
                  </Link>
                )
                : record.name
            }
          </Text>
        </Grid>
        {
          record.username && (
            <Grid xs={12}>
              <Text>Username: </Text> &nbsp; <Text css={{color: "$accents8"}}>{record.username}</Text>
            </Grid>
          )
        }
        <Grid xs={12}>
          <Text>Password: </Text> &nbsp; <Text css={{ color: "$accents8" }}>{record.password}</Text>
        </Grid>
      </Grid.Container>
    </Card.Body>
    <Card.Footer>
      <Button size="sm" onPress={closePopover}>
        Close
      </Button>
    </Card.Footer>
  </Card>
);
