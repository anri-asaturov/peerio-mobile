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
}

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)
        echo "Linux..."
        npm run build-android-debug
        # adb install -r android/app/build/outputs/apk/app-x86-debug.apk
        ;;
    Darwin*)
        info 'Mac...'
        wait 'Unbooting booted simulators'
        xcrun simctl list devices | grep -i "booted" | grep -Eo "\([A-F0-9-]+\)" | tr -d '()' | xargs xcrun simctl shutdown
        sleep 3
        info 'Killing running simulators'
        (kill $(ps aux | grep '[S]imulator.app' | awk '{print $2}')) && check 'done!'
        sleep 3
        SIM_UDID=`xcrun instruments -s | grep -E "$PEERIO_IOS_SIM \($PEERIO_IOS_VERSION.*\)" | grep -o "\[.*\]" | tr -d '[]' | head -1`
        info "Looking for simulator: $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)"
        if [ -z $"$SIM_UDID" ]; then
          error "Could not find simulator: $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)"
          echo "Available simulators:"
          xcrun instruments -s
          exit 1
        fi
        check "found $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION) $SIM_UDID$"
        SIM_LOG="$HOME/Library/Logs/CoreSimulator/$SIM_UDID/system.log"
        check "logs ${SIM_LOG}"
        # ./node_modules/.bin/react-native run-ios --simulator=$SIM_UDID
        ;;
esac

./node_modules/.bin/appium > /dev/null &
APPIUM_PID=$!

trap "exit" INT TERM
trap "kill $APPIUM_PID" EXIT
sleep 1

wait "Waiting appium to launch on 4723..."

while ! nc -z localhost 4723; do
  sleep 0.1
done

check "appium launched"

npm run test-$PEERIO_TEST_PLATFORM

# if [ -z $"$CIRCLE_ARTIFACTS" ]; then
#   exit 0
# else
#   mkdir -p $CIRCLE_ARTIFACTS/py.test/
#   cp $SIM_LOG $CIRCLE_ARTIFACTS/py.test/
# fi
