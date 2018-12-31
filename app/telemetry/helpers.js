import { Dimensions, Platform } from 'react-native';
import deviceInfo from 'react-native-device-info';
import { vars } from '../styles/styles';

const { height, width } = Dimensions.get('window');

class TmHelper {
    send(telemetry, event) {
        // Basic properties to send with all events.
        // There are additional baseProps on SDK. These are mobile-specific.
        const baseProps = {
            screenWidth: width,
            screenHeight: height,
            brand: deviceInfo.getBrand(),
            model: deviceInfo.getModel(),
            screenDpi: vars.devicePixelRatio,
            operatingSystem: Platform.OS,
            osVersion: Platform.Version
        };
        if (__DEV__) baseProps.eventTime = Date.now();
        const obj = {
            event: event[0],
            properties: event[1] || {}
        };
        // Required for Telemetry Analyst to debug signup and login telemetry events in order
        if (__DEV__) baseProps.eventTime = Date.now();
        obj.properties = Object.assign(obj.properties, baseProps);
        telemetry.send(obj);
    }
}

const tmHelper = new TmHelper();
export default tmHelper;
