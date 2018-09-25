import React from 'react';
import { View, Image, Dimensions, StatusBar } from 'react-native';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { tx } from '../utils/translator';
import loginState from './login-state';
import ActivityOverlay from '../controls/activity-overlay';
import { vars, signupStyles } from '../../styles/styles';
import buttons from '../helpers/buttons';
import DebugMenu from '../shared/debug-menu';
import DebugMenuTrigger from '../shared/debug-menu-trigger';
import SafeComponent from '../shared/safe-component';
import LoginHeading from './login-heading';
import { adjustImageDimensions } from '../helpers/image';
import { telemetry } from '../../lib/icebear';
import tm from '../../telemetry';
import TmHelper from '../../telemetry/helpers';

const { S } = telemetry;

const logoWelcome = require('../../assets/peerio-logo-dark.png');
const imageWelcome = require('../../assets/welcome-illustration.png');

const { height } = Dimensions.get('window');

const logoBar = {
    alignItems: 'center',
    height: vars.welcomeHeaderHeight,
    backgroundColor: vars.darkBlue
};

const buttonContainer = {
    marginBottom: vars.spacing.small.maxi,
    alignItems: 'flex-start'
};

@observer
export default class LoginWelcome extends SafeComponent {
    @action.bound onSignupPress() {
        tm.signup.onStartAccountCreation();
        loginState.routes.app.signupStep1();
    }

    @action.bound onLoginPress() {
        tm.login.onNavigateLogin();
        loginState.routes.app.loginClean();
    }

    componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.WELCOME_SCREEN;
    }

    componentWillUnmount() {
        tm.signup.duration(this.startTime);
    }

    render() {
        return (
            <View style={[signupStyles.page, { flexGrow: 1 }]}>
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <Image
                        resizeMode="contain"
                        source={imageWelcome}
                        style={{ height, alignSelf: 'center' }} />
                </View>
                <DebugMenu />
                <DebugMenuTrigger>
                    <View style={logoBar}>
                        <Image
                            source={logoWelcome}
                            style={adjustImageDimensions(logoWelcome, undefined, vars.welcomeHeaderHeight)} />
                    </View>
                </DebugMenuTrigger>
                <View style={[signupStyles.container, { paddingHorizontal: signupStyles.pagePaddingLarge }]}>
                    <LoginHeading title="title_newUserWelcome" subTitle="title_newUserWelcomeDescription" />
                    <View style={buttonContainer}>
                        {buttons.roundBlueBgButton(
                            tx('button_CreateAccount'),
                            this.onSignupPress,
                            null,
                            'button_CreateAccount',
                            { width: vars.roundedButtonWidth, marginBottom: vars.spacing.small.midi2x }
                        )}
                        {buttons.roundWhiteBgButton(
                            tx('button_login'),
                            this.onLoginPress,
                            null,
                            'button_login',
                            { width: vars.roundedButtonWidth }
                        )}
                    </View>
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
                <StatusBar hidden />
            </View>
        );
    }
}
