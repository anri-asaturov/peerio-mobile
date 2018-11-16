import { AppRegistry, UIManager, Platform } from 'react-native';
import './shim';
import App from './app/components/App';

global.platform = 'android';

function enableAndroidAnimation() {
    // skip for Android 7.0 (API 24)
    if (Platform.Version === 24) return;
    // skip if we don't have the native capability
    if (!UIManager.setLayoutAnimationEnabledExperimental) return;
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

enableAndroidAnimation();

AppRegistry.registerComponent('peeriomobile', () => App);
