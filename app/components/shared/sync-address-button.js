import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import { contactState } from '../states';

@observer
export default class SyncAddressButton extends SafeComponent {
    renderThrow() {
        return (
            <View style={{ alignItems: 'center' }}>
                {buttons.roundBlueBgButton(
                    'button_syncAddressBook',
                    contactState.testImport,
                    null,
                    null,
                    { width: 247 }
                )}
            </View>
        );
    }
}
