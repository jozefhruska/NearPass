import React from 'react';
import { Button, Navbar, Link, Spacer, Text } from '@nextui-org/react';

export default ({ isSignedIn, wallet }) => {
  return (
    <>
      <Navbar isBordered variant="static">
        <Navbar.Brand>
          <Text b color="inherit" hideIn="xs">
            NEAR Password Manager
          </Text>
        </Navbar.Brand>
        <Navbar.Content>
          {
            isSignedIn
              ? (
                <Navbar.Item>
                  <Button auto flat onPress={() => wallet.signOut()}>
                    Sign out {wallet?.accountId}
                  </Button>
                </Navbar.Item>
              )
              : (
                <>
                  <Navbar.Item>
                    <Button auto flat onPress={() => wallet.signIn()}>
                      Login
                    </Button>
                  </Navbar.Item>
                  <Navbar.Item>
                    <Button auto flat onPress={() => wallet.signIn()}>
                      Sign Up
                    </Button>
                  </Navbar.Item>
                </>
              )
          }
        </Navbar.Content>
      </Navbar>
      <Spacer y={3} />
    </>
  )
}
