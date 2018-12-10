import { Platform } from 'react-native';
import PaymentsIos from './payments-ios';
import PaymentsAndroid from './payments-android';

export default (Platform.OS === 'android' ? new PaymentsAndroid() : new PaymentsIos());
