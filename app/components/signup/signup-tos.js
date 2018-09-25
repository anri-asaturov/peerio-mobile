import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { T, tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import ViewWithDrawer from '../shared/view-with-drawer';
import { TopDrawerBackupAccountKey } from '../shared/top-drawer-components';
import { drawerState, uiState } from '../states';
import { socket, telemetry } from '../../lib/icebear';
import routes from '../routes/routes';
import TosAccordion from './tos-accordion';
import { popupTOS, popupPrivacy } from '../shared/popups';
import TmHelper from '../../telemetry/helpers';
import tm from '../../telemetry';

const { S } = telemetry;

const { height } = Dimensions.get('window');

const buttonContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

@observer
export default class SignupTos extends SafeComponent {
    componentWillMount() {
        // no other drawers in signup except for backup account key, so we can do it
        drawerState.dismissAll();
    }

    componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.TERMS_OF_USE;
        if (!signupState.keyBackedUp) {
            drawerState.addDrawer(TopDrawerBackupAccountKey);
        }
    }

    componentWillUnmount() {
        tm.signup.duration(this.startTime);
    }

    @action.bound cancelSignup() {
        tm.signup.navigate(S.CANCEL);
        routes.app.signupCancel();
    }

    @action.bound
    async finishSignup() {
        tm.signup.acceptTos();
        await signupState.finishAccountCreation();
        uiState.isFirstLogin = true;
        signupState.next();
    }

    get content() {
        return (
            <View>
                <Text style={signupStyles.description}>
                    {<T k="title_termsDescription">
                        {{
                            openTerms: this.openTermsLink,
                            openPrivacy: this.openPrivacyLink
                        }}
                    </T>}
                </Text>
                <TosAccordion />
            </View>
        );
    }

    @action.bound openTermsLink(text) {
        const onPress = async () => {
            tm.signup.readMorePopup(S.TERMS_OF_USE);
            await popupTOS();
        };
        return (<Text style={{ color: vars.peerioBlue }} onPress={onPress}>{text}</Text>);
    }

    @action.bound openPrivacyLink(text) {
        const onPress = async () => {
            tm.signup.readMorePopup(S.PRIVACY_POLICY);
            await popupPrivacy();
        };
        return (<Text style={{ color: vars.peerioBlue }} onPress={onPress}>{text}</Text>);
    }

    renderThrow() {
        return (
            <ViewWithDrawer style={[signupStyles.page, { height }]}>
                <View style={signupStyles.container2}>
                    <Text semibold serif style={signupStyles.headerStyle2}>
                        {tx('title_termsOfUseSentenceCase')}
                    </Text>
                    {this.content}
                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_decline'),
                            this.cancelSignup,
                            !socket.connected,
                            null,
                            'button_decline'
                        )}
                        <View style={{ width: 24 }} />
                        {buttons.roundBlueBgButton(
                            tx('button_accept'),
                            this.finishSignup,
                            !socket.connected,
                            'button_accept'
                        )}
                    </View>
                </View>
            </ViewWithDrawer>
        );
    }
}
