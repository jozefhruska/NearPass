import React from 'react';
import { Button, Navbar, Spacer, Text } from '@nextui-org/react';

export default ({
  hasEnoughFunds,
  isSignedIn,
  openKeyPhraseModal,
  wallet,
  setIsAddRecordModalOpen,
  setIsNotEnoughNearModalOpen,
}) => {
  return (
    <>
      <Navbar isBordered variant="static">
        <Navbar.Brand>
          <Text b color="inherit" hideIn="xs">
            NearPass
          </Text>
        </Navbar.Brand>
        <Navbar.Content>
          {
            isSignedIn
              ? (
                <>
                  <Navbar.Item>
                    <Button auto onPress={
                      () => hasEnoughFunds
                        ? setIsAddRecordModalOpen(true)
                        : setIsNotEnoughNearModalOpen(true)
                    }>
                      Add password
                    </Button>
                  </Navbar.Item>
                  {/*<Navbar.Item>*/}
                  {/*  <Button auto flat onPress={openKeyPhraseModal}>*/}
                  {/*    Change passphrase*/}
                  {/*  </Button>*/}
                  {/*</Navbar.Item>*/}
                  <Navbar.Item>
                    <Button auto flat onPress={() => wallet.signOut()}>
                      Sign out {wallet?.accountId}
                    </Button>
                  </Navbar.Item>
                </>
              )
              : (
                <>
                  <Navbar.Item>
                    <Button auto flat onPress={() => wallet.signIn() && openKeyPhraseModal()}>
                      Login
                    </Button>
                  </Navbar.Item>
                  <Navbar.Item>
                    <Button auto flat onPress={() => wallet.signIn() && openKeyPhraseModal()}>
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
