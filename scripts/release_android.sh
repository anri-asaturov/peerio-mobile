#!/bin/bash
# stop execution on error
set -e

function signapk(){
  echo ==========================================================
  echo "SIGNING: $1 => $2"
  echo ==========================================================
  jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore peerio.keystore -storepass:file peerio.keystorepass $1 peerio_release_key

  echo ========== VERIFYING ==========
  jarsigner -verify -verbose -certs $1

  echo ========== ZIPALIGN ==========
  zipalign -f -v 4 $1 $2
}

function resigndebugapk() {
  if [ -f $1 ]; then
    zip -d $1 'META-INF/*.*F' 'META-INF/*.RSA' || true
    signapk $1 $2
  else
    echo "Debug $1 does not exist. Skipping"
  fi
}

DATE=`date +%Y-%m-%d`
APK_PATH='./android/app/build/outputs/apk'
OUTPUT='./apk'
RELEASE_APK_PATH="$APK_PATH/release"
RELEASE_ARM="$RELEASE_APK_PATH/app-armeabi-v7a-release-unsigned.apk"
RELEASE_X86="$RELEASE_APK_PATH/app-x86-release-unsigned.apk"
DEBUG_APK_PATH="$APK_PATH/debug"
DEBUG_ARM="$DEBUG_APK_PATH/app-armeabi-v7a-debug.apk"
DEBUG_X86="$DEBUG_APK_PATH/app-x86-debug.apk"

rm -rf $OUTPUT
mkdir -p $OUTPUT
signapk $RELEASE_ARM "$OUTPUT/release-armeabi-v7a-signed.apk"
signapk $RELEASE_X86 "$OUTPUT/release-x86-signed.apk"

resigndebugapk $DEBUG_ARM "$OUTPUT/debug-armeabi-v7a-signed.apk"
resigndebugapk $DEBUG_X86 "$OUTPUT/debug-x86-signed.apk"

echo ============================================
echo "||             BUILD SUCCESS              ||"
echo ============================================
