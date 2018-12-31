#!/bin/bash

echo "Checking env.sh"
echo `pwd`
# ls -la app/lib
# ls -la app/lib/peerio-icebear
if [ ! -f env.sh ]; then
  echo "Creating env.sh"
  echo "export PEERIO_SOCKET_SERVER=$PEERIO_SOCKET_SERVER" > env.sh
  echo "export VERBOSE_LOGS=1" >> env.sh
fi
mkdir -p app/lib/peerio-icebear
cd node_modules/react-native
./scripts/ios-install-third-party.sh
rm -rf third-party/glog-0.3.4/test-driver
