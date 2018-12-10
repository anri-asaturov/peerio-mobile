#!/bin/bash

source env.sh

# import detectIosUDID, info, error, check, wait
source scripts/common.sh

detectIosUDID
./node_modules/.bin/react-native run-ios --simulator="$SIM_UDID"


