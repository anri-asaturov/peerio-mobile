import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../../shared/safe-component';

@observer
export default class MedcryptorSettingsHelpButton extends SafeComponent {
    renderThrow() {
        return <View />;
    }
}
