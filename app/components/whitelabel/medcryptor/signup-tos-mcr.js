import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Linking } from 'react-native';
import { action } from 'mobx';
import Text from '../../controls/custom-text';
import SignupTos from '../../signup/signup-tos';
import { tx } from '../../utils/translator';
import vars from '../../../styles/vars';

@observer
export default class SignupTermsOfUseMedcryptor extends SignupTos {
    @action.bound
    readTos() {
        Linking.openURL('https://medcryptor.com/legal/terms-of-use');
    }

    @action.bound
    readPrivacy() {
        Linking.openURL('https://medcryptor.com/legal/privacy-policy');
    }

    get content() {
        return (
            <View>
                <Text
                    style={{ color: vars.peerioBlue, paddingTop: vars.spacing.medium.maxi2x }}
                    onPress={this.readTos}>
                    {tx('title_termsOfUse')}
                </Text>
                <Text
                    style={{ color: vars.peerioBlue, paddingBottom: vars.spacing.medium.maxi2x }}
                    onPress={this.readPrivacy}>
                    {tx('title_privacyPolicy')}
                </Text>
            </View>
        );
    }
}
