#!/bin/bash

source env.sh

adb reverse tcp:$TEST_LISTENER_PORT tcp:$TEST_LISTENER_PORT

