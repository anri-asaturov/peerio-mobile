import { Platform } from 'react-native';

function testLabel(id) {
    if (!__DEV__ || !id) return {};
    if (Platform.OS === 'android') {
        return {
            accessible: true,
            accessibilityLabel: id
        };
    }
    return {
        accessible: true,
        testID: id
    };
}

export default testLabel;
