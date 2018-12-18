#!/bin/bash

source env.sh
RED=`tput setaf 1`
GREEN=`tput setaf 2`
YELLOW=`tput setaf 3`
BRIGHT=`tput bold`
R=`tput sgr0`

info() {
  echo -e "${BRIGHT}$1${R}"
}

error() {
  echo -e "${BRIGHT}$1${R}"
}


wait() {
  echo -e "💤  ${BRIGHT}$1${R}"
}

check() {
  echo "${GREEN}✔ $1${R}"
  printf "\n"
}

detectIosUDID() {
    SIM_UDID=`xcrun instruments -s | grep -E "$PEERIO_IOS_SIM \($PEERIO_IOS_VERSION.*\)" | grep -o "\[.*\]" | tr -d '[]' | head -1`
    info "Looking for simulator: $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)"
    if [ -z $"$SIM_UDID" ]; then
        error "Could not find simulator: $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)"
        echo "Available simulators:"
        xcrun instruments -s
        exit 1
    fi
    check "found $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION) $SIM_UDID"
    export SIM_UDID=$SIM_UDID
} 

# export detectIosUDID, info, error, check, wait
