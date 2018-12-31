#!/bin/bash

source env.sh

# import detectIosUDID, info, error, check, wait
source scripts/common.sh

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
        detectIosUDID
        SIM_LOG="$HOME/Library/Logs/CoreSimulator/$SIM_UDID/system.log"
        check "logs ${SIM_LOG}"
        # ./node_modules/.bin/react-native run-ios --simulator=$SIM_UDID
        ;;
esac

./node_modules/.bin/appium > /dev/null &
APPIUM_PID=$!
TEST_EXITCODE=0

cleanup() {
  echo "...cleanup"
  trap "" EXIT
  kill $APPIUM_PID
  exit $TEST_EXITCODE
}

trap cleanup INT TERM EXIT

sleep 1
wait "Waiting appium to launch on 4723..."

while ! nc -z localhost 4723; do
  sleep 0.1
done

check "appium launched"

npm run test-$PEERIO_TEST_PLATFORM
TEST_EXITCODE=$?

if [ -z $"$CIRCLE_TEST_REPORTS" ]; then
  echo "Skipping CircleCI report generation"
else
  echo "Generating CircleCI report in $CIRCLE_TEST_REPORTS"
  mkdir -p $CIRCLE_TEST_REPORTS/cucumberjs
  cat test/reports/result-$PEERIO_TEST_PLATFORM.json | node_modules/.bin/cucumber-junit > "$CIRCLE_TEST_REPORTS/cucumberjs/report.xml"
  node test/reports/generate-circleci-report.js
fi


if [ -z $"$CIRCLE_ARTIFACTS" ]; then
  echo "Skipping CircleCI artifact generation"
else
  echo "Generating CircleCI artifact report in $CIRCLE_ARTIFACTS"
  mkdir -p $CIRCLE_ARTIFACTS
  node test/reports/generate-circleci-report.js
  cp -r test/reports/* $CIRCLE_ARTIFACTS/
fi
