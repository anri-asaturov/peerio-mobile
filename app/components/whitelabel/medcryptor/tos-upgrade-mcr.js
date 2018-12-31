import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Linking, Platform } from 'react-native';
import { action } from 'mobx';
import { tx } from '../../utils/translator';
import vars from '../../../styles/vars';
import SafeComponent from '../../shared/safe-component';
import Text from '../../controls/custom-text';

@observer
export default class TermsOfUseUpgradeMedcryptor extends SafeComponent {
    @action.bound
    readTos() {
        Linking.openURL('https://medcryptor.com/legal/terms-of-use');
    }

    @action.bound
    readPrivacy() {
        Linking.openURL('https://medcryptor.com/legal/privacy-policy');
    }

    get annual() {
        return `Annual plans will be charged $300 AUD/year to your iTunes account at confirmation of purchase. You can manage your subscriptions and turn off auto-renewal by going to your iTunes Account Settings after purchase.

Your subscription will renew automatically at the end of each billing period unless you disable auto-renew at least 24-hours before the end of your current billing period.

If your subscription is renewed, your account will be charged for renewal within 24-hours prior to the end of the current period.`;
    }

    get monthly() {
        return `Monthly plans will be charged $25 AUD/month to your iTunes account at confirmation of purchase. You can manage your subscriptions and turn off auto-renewal by going to your iTunes Account Settings after purchase.
        
Your subscription will renew automatically at the end of each billing period unless you disable auto-renew at least 24-hours before the end of your current billing period.

If your subscription is renewed, your account will be charged for renewal within 24-hours prior to the end of the current period.`;
    }

    get ios() {
        const { title } = this.props;
        return (
            <View>
                <Text
                    semibold
                    style={{
                        color: vars.black54,
                        fontSize: vars.font.size12,
                        paddingBottom: 10
                    }}>
                    {tx(title === 'title_monthly' ? this.monthly : this.annual)}
                </Text>
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

    get android() {
        return (
            <Text
                semibold
                style={{
                    color: vars.black54,
                    fontSize: vars.font.size12,
                    paddingBottom: 60
                }}>
                {tx(this.props.paymentInfo)}
            </Text>
        );
    }

    renderThrow() {
        return Platform.OS === 'ios' ? this.ios : this.android;
    }
}
