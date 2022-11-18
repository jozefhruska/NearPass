import React from "react";
import { Text, Grid } from "@nextui-org/react";

export const CustomTooltip = ({
}) => {
  return (
    <Grid.Container
      css={{
        mw: "450px",
        borderRadius: "$lg",
        padding: "$sm",
      }}
    >
      <Grid.Container>
        <Grid xs={12}>
          <Text
            size={14}
            css={{ mt: "$1" }}
            color="#888888"
          >
            After completing payment via stripe, smart contract will allocate certain amount of storage to your account (via allocating NEAR tokens).
          </Text>
        </Grid>

      </Grid.Container>
      <Grid.Container>
        <Grid xs={12}>
          <Text
            size={14}
            css={{ mt: "$1" }}
            color="#888888"
          >
            On top of that, you will receive small amount of NEAR to your account for NEAR fees (gas).
          </Text>
        </Grid>

      </Grid.Container>
      <Grid.Container
        justify="flex-start"
        alignContent="center"
      >
        <Text b size={14} color="#888888">
          Alternatively, you can just transfer enough NEAR tokens into your wallet 🙂
        </Text>
      </Grid.Container>
    </Grid.Container>
  );
};
