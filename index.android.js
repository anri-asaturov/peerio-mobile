import {
    AppRegistry, UIManager
} from 'react-native';
import './shim';
import App from './app/components/App';

global.platform = 'android';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent('peeriomobile', () => App);
