import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { T, tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import { TopDrawerBackupAccountKey } from '../shared/top-drawer-components';
import { drawerState } from '../states';
import { socket, telemetry } from '../../lib/icebear';
import SignupHeading from './signup-heading';
import routes from '../routes/routes';
import tm from '../../telemetry';
import { popupTOS, popupPrivacy } from '../shared/popups';

const { S } = telemetry;

const buttonContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

const sublocation = S.CANCEL_SIGN_UP;

@observer
export default class SignupCancel extends SafeComponent {
    componentDidMount() {
        this.startTime = Date.now();
        if (!signupState.keyBackedUp) {
            drawerState.addDrawer(TopDrawerBackupAccountKey);
        }
    }

    componentWillUnmount() {
        tm.signup.duration({ sublocation, startTime: this.startTime });
    }

    @action.bound
    openTermsLink(text) {
        const onPress = async () => {
            tm.signup.readMorePopup({ item: S.TERMS_OF_USE });
            await popupTOS();
        };
        return (
            <Text style={{ color: vars.peerioBlue }} onPress={onPress}>
                {text}
            </Text>
        );
    }

    @action.bound
    openPrivacyLink(text) {
        const onPress = async () => {
            tm.signup.readMorePopup({ item: S.PRIVACY_POLICY });
            await popupPrivacy();
        };
        return (
            <Text style={{ color: vars.peerioBlue }} onPress={onPress}>
                {text}
            </Text>
        );
    }

    @action.bound
    cancel() {
        tm.signup.declineTos();
        drawerState.dismissAll();
        signupState.exit();
    }

    @action.bound
    goBack() {
        routes.app.signupStep1();
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <SignupHeading title="title_cancelSignup" />
                    <Text
                        style={[
                            signupStyles.subTitle,
                            { marginBottom: vars.spacing.medium.midi2x }
                        ]}>
                        {tx('title_declineExplanation')}
                    </Text>
                    <Text semibold style={signupStyles.subTitle}>
                        {tx('title_whyRequired')}
                    </Text>
                    <Text style={signupStyles.description2}>
                        {
                            <T k="title_whyRequiredExplanation">
                                {{
                                    openPrivacy: this.openPrivacyLink,
                                    openTerms: this.openTermsLink
                                }}
                            </T>
                        }
                    </Text>

                    <Text semibold style={signupStyles.subTitle}>
                        {tx('title_signupAgain')}
                    </Text>
                    <Text style={signupStyles.description2}>
                        {tx('title_signupAgainExplanation')}
                    </Text>

                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_confirmCancel'),
                            this.cancel,
                            !socket.connected,
                            null,
                            'button_decline'
                        )}
                        <View style={{ width: 16 }} />
                        {buttons.roundBlueBgButton(
                            tx('button_goBack'),
                            this.goBack,
                            !socket.connected,
                            'button_accept'
                        )}
                    </View>
                </View>
            </View>
        );
    }
}
