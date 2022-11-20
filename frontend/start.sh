#!/bin/sh

CONTRACT_DIRECTORY=../contract
DEV_ACCOUNT_FILE="${CONTRACT_DIRECTORY}/neardev/dev-account.env"

start () {
  echo The app is starting!
  parcel index.html --open
}

start
