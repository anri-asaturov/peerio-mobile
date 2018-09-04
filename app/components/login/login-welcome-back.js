import React from 'react';
import { View, StatusBar } from 'react-native';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { T, tx } from '../utils/translator';
import loginState from './login-state';
import ActivityOverlay from '../controls/activity-overlay';
import { vars, signupStyles } from '../../styles/styles';
import SafeComponent from '../shared/safe-component';
import Text from '../controls/custom-text';
import IntroStepIndicator from '../shared/intro-step-indicator';
import SignupButtonBack from '../signup/signup-button-back';
import LoginInputs from './login-inputs';
import { User } from '../../lib/icebear';

const marginBottom = 10;
const marginTop = vars.spacing.small.maxi2x;

const titleStyle = {
    fontSize: 24, // TODO: accomodate for iPhone SE
    color: vars.darkBlue,
    marginBottom
};

const subtitleStyle = {
    fontSize: 14, // TODO: accomodate for iPhone SE
    color: vars.textBlack54,
    marginBottom: marginBottom + 10
};

@observer
export default class LoginWelcomeBack extends SafeComponent {
    @observable lastUser;

    async componentDidMount() {
        this.lastUser = await User.getLastAuthenticated();
    }

    @action.bound onSignupPress() {
        loginState.routes.app.signupStep1();
    }

    @action.bound onLoginPress() {
        loginState.routes.app.loginClean();
    }

    @action.bound switchUserLink(text) {
        return (
            <Text style={{ color: vars.peerioBlue }} onPress={() => { loginState.clearLastUser(); }}>
                {text}
            </Text>
        );
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <IntroStepIndicator max={1} current={1} />
                <View style={[signupStyles.container, { paddingHorizontal: signupStyles.pagePaddingLarge }]}>
                    <SignupButtonBack clearLastUser />
                    <View style={{ marginTop }}>
                        <Text semibold serif style={titleStyle}>
                            {tx('title_welcomeBackFirstname', { firstName: this.lastUser.firstName })}
                        </Text>
                        <T k="title_switchUser" style={subtitleStyle}>
                            {{
                                username: this.lastUser.username,
                                switchUser: this.switchUserLink
                            }}
                        </T>
                    </View>
                    <LoginInputs hideUsernameInput />
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
                <StatusBar hidden />
            </View>
        );
    }
}
