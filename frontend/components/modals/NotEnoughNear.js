import React from "react";
import { Text, Button, Modal, Card, Col, Row, Tooltip } from '@nextui-org/react';
import LogoSvg from '../../assets/images/logo/logo-white.svg'
import PovertyJpg from '../../assets/poverty.jpg'
import { CustomTooltip } from '../CustomTooltip';

export const NotEnoughNear = ({
  isOpen,
  setIsOpen,
  userId,
}) => (
  <Modal
    aria-labelledby="Add record"
    open={isOpen}
    onClose={() => setIsOpen(false)}
    preventClose
    width="600px"
  >
    <Modal.Header css={{position: 'absolute', zIndex: 1, top: 5}}>
    </Modal.Header>
    <Modal.Body css={{p: 0}}>
      <Card css={{w: '100%', h: '500px'}}>
        <Card.Header css={{position: 'absolute', zIndex: 1, top: 5}}>
          <Col>
            <Text size={12} weight="bold" transform="uppercase" color="#9E9E9E">
              It seems that your wallet doesn't have enough NEAR tokens
            </Text>
            <Text h3 color="white">
              Let us handle that.
            </Text>
          </Col>
        </Card.Header>
        <Card.Body css={{p: 0}}>
          <Card.Image
            src={PovertyJpg}
            objectFit="cover"
            width="100%"
            height="100%"
            alt="Not enough tokens background image"
          />
        </Card.Body>
        <Card.Footer
          isBlurred
          css={{
            position: 'absolute',
            bgBlur: '#0f111466',
            borderTop: '$borderWeights$light solid $gray800',
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Row>
            <Col>
              <Row>
                <Col span={2}>
                  <Card.Image
                    src={LogoSvg}
                    css={{bg: 'black', br: '50%'}}
                    height={40}
                    width={40}
                    alt="Near Icon"
                  />
                </Col>
                <Col>
                  <Text color="#d1d1d1" size={12}>
                    With NearPass starter pack you will be able to safely & securely store up to
                    50 passwords on chain.&nbsp;
                    <Tooltip
                      placement="top"
                      content={<CustomTooltip/>}
                      style={{
                        cursor: 'pointer',
                        display: 'inline',
                        textDecoration: 'underline',
                      }}>
                      How does it work?
                    </Tooltip>
                  </Text>
                </Col>
              </Row>
            </Col>
            <Col span={3}>
              <Row justify="flex-end">
                <a
                  href={`https://buy.stripe.com/aEU7th4mT6Xw5gcbII?client_reference_id=${userId.replace('.', '__')}`}>
                  <Button
                    flat
                    auto
                    rounded
                    css={{color: '#94f9f0', bg: '#94f9f026'}}
                  >
                    <Text
                      css={{color: 'inherit'}}
                      size={12}
                      weight="bold"
                      transform="uppercase"
                    >
                      Buy for 2.99€
                    </Text>
                  </Button>
                </a>
              </Row>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Modal.Body>
    <Modal.Footer css={{p: 0}}>
    </Modal.Footer>
  </Modal>
);
