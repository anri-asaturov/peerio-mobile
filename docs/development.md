# Development

## Project structure

Project main language is ECMAScript2016 (with extensions), with main package manager being npm (node version 8).
Source code is located in `app` folder.
Platform-specific (Objective-C for iOS and Java for Android) projects are located in `ios` and `android` folders, respectively.
Environment configuration scripts are situated in `scripts` folder.
Environment settings (for debug packager) are located in `env.sh` file in the root of the project.
Fastlance configuration is stored in `fastlane` folder.
CircleCI build and test process is provided in `circle.yml` file.

To figure out how the application works, check out [React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html), if you haven't done so yet. Select the "Building Projects with Native Code" tab and make sure you have all of the dependencies installed and the Android development environment set up.

In short, platform specific code (mostly generated from react-native boilerplate) loads the bundled JavaScript code into JavaScriptCore engine see [JavaScript Environment](https://facebook.github.io/react-native/docs/javascript-environment.html), which, during its lifecycle, instructs native part, which views to create, which events to handle, and so forth.

This communication is done asynchronously via JSCore/JavaScript bridge (see [NativeModules](https://facebook.github.io/react-native/docs/native-modules-ios.html)). There's no support for binary data interaction yet, so all binary data should be passed as base64 string.

JavaScript code is bundled using react-native packager. For debugging purposes, react-native packager can be run in background, providing "Live Reload" and "Hot Reload" features to be able to edit and reload JS code quickly. Otherwise, packager generates JS bundle (for example, `ios/main.jsbundle`) during the build process automatically.

Please not, that JavaScriptCore is pretty limited JS environment and does not support all the features of WebKit-based browsers, as well as JIT.

To accomodate for the former, Babel configuration is used (`.babelrc`). We currently use these extended features:
* decorators
* es6 classes
* destructurizing operators
* async/await
* arrow functions
* extended Promises (bluebird)

Platform-specific build settings are saved in `ios/peeriomobile.xcodeproj` for iOS and `*.gradle` files for Android.

Platform-specific code is managed using react-native NativeModules infrastrucutre and installed and maintained as npm packages. Most RN packages are forked for Peerio at this moment.

Some of the code is placed directly in the platform projects, for example, native crypto functions, and maintained there as well. This is a subject for change (code should be moved to a separate plugin).

Deploy is managed via fastlane (check out [fastlane docs](https://docs.fastlane.tools/)

## Icebear library connection

Icebear library, which provides all the server API communication, and encryption (apart from native-implemented scrypt and signature/verification due to performance issues on JavaScriptCore without JIT) is provided via the `peerio-icebear` module.

During postinstall step (which is called on build and during debug) icebear library is transpiled onto app/lib/peerio-icebear. The application uses it from there and injects some mocks/polyfills when doing so (primarily because peerio-icebear library is build for full V8 environment, which has some capabilities which JavaScriptCore misses).

If you are working with a local version of `peerio-icebear`, you can use `npm link` to link your local version. 

For example: 
```
cd peerio-icebear
npm link
cd ../peerio-mobile
npm link peerio-icebear 
npm install
```

When working with SDK closely, it's recommended to add `npm link peerio-icebear` to `npm start` script. That way, peerio-icebear will be automatically linked when you run the packager. 

**N.B.** Linking any other module with `npm link` will *not* work with the ReactMobile packager.

### Developing on peerio-mobile and peerio-icebear concurrently

In order to develop a feature on both peerio-mobile and peerio-icebear in parallel, link the packages as described above, then run `npm start` and in another terminal run `npm run ios`

When updating your local copy of peerio-icebear, run `npm run icebear:compile` to babel the changes and reload the app (with Cmd+R). See the section on [debugging](#debugging) below for more about the packager. 

## Prepare environment

You should have Node v8, brew, latest XCode and Android Studio 3 installed to build the project in both supported OS.

pull the project and run:

`npm install`

Please note, that in the `postinstall` step native platform files get patched to be able to load JS bundle from packager in debug mode. The script `scripts/setup-rn-debugging.sh` which does the patching gets the current IP with ifconfig and puts it in the React Native library sources.

Will not work for **non Mac & Linux users** as the script does not support that (yet).

Configure the backend socket server to use the staging server, by editing the files `env.sh` **and** `/scripts/node-env-peerio.sh` (generated during postinstall step).

```
export PEERIO_SOCKET_SERVER='wss://hocuspocus.peerio.com'
```

For [debugging](#debugging) (see below), you will need [watchman](https://facebook.github.io/watchman/docs/install.html). On Mac `brew install watchman`

## iOS

To build, you would need latest XCode and brew installed.

To build the project and run it in default simulator, run `npm run ios`

To debug the project or run it on actual device (or a different simulator), use XCode with the `ios/peeriomobile.xcodeproj` file.

## Android

You need to have Android SDK installed. You also need Android NDK installed, and it needs to specifically be version `android-ndk-r10e`, which cannot be downloaded within Android Studio but must be [downloaded directly](https://developer.android.com/ndk/downloads/index.html). 

Current recommended Android Studio version is 3.1.3. Gradle version 4.4.

Please note that react-native project had changes incorporated to support both implemented in our fork.

Set the following environment variables to point to your installations of the NDK and SDK: 

On macOS, it might look something like this:
```
export ANDROID_NDK=/Users/.../Library/Android/ndk/android-ndk-r10e
export ANDROID_SDK=/Users/.../Library/Android/sdk
export ANDROID_HOME=$ANDROID_SDK
```

*Insert your username, and note that these paths will be different in Linux, of course.*

We use [GenyMotion](https://www.genymotion.com/) as simulators as they are much faster than the ones shipped with Android SDK. The "personal version" is all that is needed for our purposes. Follow the Genymotion instructions for getting set up.

To build and run, start a simulator (or connect a device) and then run `npm run android`.

To debug, use Android Studio, or any other Java and Gradle compatible environment. Gradle project root is `android/settings.gradle`.

Please note that because React Native is forked for our project, all the react-native modules (from node_modules) are updated to use the React Native project from the gradle file (and not the pre-built version from maven). See `scripts/android-switch-to-rn-fork.sh` for more information.

## <a name="debugging"></a> Debugging

The native application when run in Debug scheme will try to load JS bundle from packager, accessible from localhost:8081 for iOS simulators and either YOUR-IP:8081 (setup with setup-rn-debugging script) or localhost:8081 from simulator network (using adb reverse).

If no packager is present, it will fallback to bundle file after a timeout.

To start the react-native debug packager, run the following command:

`npm start`

Same react-native packager instance serves both Android and iOS bundles as well as map files and provides WS bridge to reload application, hot reload and other useful debugging fetures.

When app is run from debug bundle, the following keyboard shortcuts are available:
* CMD-R to reload the app live (after changes)
* CMD-D to access debugging menu

See [React Native debugging](https://facebook.github.io/react-native/docs/debugging.html) for more info.

**Linux Users:**
1. Make sure the shell you are using is /bin/bash by using `echo $0`. If it isn't bash, you can change that by using `npm config set script-shell /bin/bash`. 
2. Create a file (anywhere, ex: on your desktop) and name it watchman-build.sh. Insert the following commands into the file:
```
apt-get install build-essential
apt-get install python-dev
apt-get install automake
apt-get install autoconf
cd /tmp
git clone https://github.com/facebook/watchman.git
cd watchman
git checkout v4.7.0  # or whatever is now the latest stable release
./autogen.sh
./configure --enable-statedir=/tmp
make
make install
mv watchman /usr/local/bin/watchman

echo 999999 | tee -a /proc/sys/fs/inotify/max_user_watches
echo 999999 | tee -a /proc/sys/fs/inotify/max_queued_events
echo 999999 | tee -a /proc/sys/fs/inotify/max_user_instances

watchman shutdown-server && sudo sysctl -p
```
Use `sudo bash watchman-build.sh` to run the commands.

## Localization

Localization is done via the `peerio-copy` package. Since `npm link` will not work for this package, push any local changes to `peerio-copy` first, then run `npm update peerio-copy` and run your build. 

## Testing

Tests are located in `tests` folder and are written in Python2.
Tests are run using py.test and Appium framework.
Appium server is run in the background before the test session begins.
Test automatically initializes a configured simulator, resets it, install the app and runs it using shared python helper library.

`npm run test`

To be expanded.

## Deploy

Deploy is done using fastlane.

To be expanded.

## Misc scripts
* android-switch-to-rn-fork.sh - patch android modules to use react-native fork
* copy-android-resources.sh - copy static resources to androud build folder from `app/assets`
* detect-circular.js - find circular references in `app` source files
* gen-der.sh, get-pem.py - generate string representations for certs
* mapper.js - map locale files
* missing-keys.js, missingkeys.js - find missing keys for locales
* node-env-peerio.sh - environment settings for android build process
* reinstall-android.sh - reinstall the app on current simulator (Android)
* reinstall-ios.sh - reinstall the app on current simulator (iOS)
* release_android.sh - sign latest build for release and for debug
* resize-all.bash, resize.bash - helper for resizing icons
* run-tests-interactive.sh - launch tests and provide interactive python shell
* run-tests.sh - run automatic tests
* setup-env.sh - generate default env.sh file
* setup-rn-debugging.sh - configure rn packager and provide IP for loading bundle
* setup_tests.sh - setup Python environment for tests
* test-create-legacy.sh - create legacy user
* test-push-body-android.json - example payload for android push
* test-push-body.json - example payload for ios push
* test-push.sh - execute test push
* testserver - run appium test server
