import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import BlueButtonText from '../buttons/blue-text-button';
import { t } from '../utils/translator';
import contactState from './contact-state';

@observer
export default class ContactsPlaceholder extends Component {
    importOrInvite() {
        contactState.routerModal.discard();
        contactState.routerMain.contactAdd();
    }

    render() {
        const s = {
            flex: 1,
            flexGrow: 1
        };
        const inner = {
            flex: 1,
            flexGrow: 2,
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
            <View style={s}>
                <View style={inner}>
                    <Text>{t('title_importInviteText')}</Text>
                    <BlueButtonText text="button_importOrInvite" onPress={this.importOrInvite} />
                </View>
                <View style={{ flex: 1, flexGrow: 3 }} />
            </View>
        );
    }
}
