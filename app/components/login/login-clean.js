import React from 'react';
import { observer } from 'mobx-react/native';
import { View, StatusBar } from 'react-native';
import { observable, action, when } from 'mobx';
import Text from '../controls/custom-text';
import { tx } from '../utils/translator';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import { vars, signupStyles } from '../../styles/styles';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';
import uiState from '../layout/ui-state';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import SignupButtonBack from '../signup/signup-button-back';
import SignupHeading from '../signup/signup-heading';
import IntroStepIndicator from '../shared/intro-step-indicator';

const { validators } = validation;
const { usernameLogin } = validators;

const findKeyText = {
    alignSelf: 'center',
    color: vars.peerioBlue,
    fontSize: vars.font.size.normal
};

@observer
export default class LoginClean extends SafeComponent {
    usernameState = observable({ value: '' });
    passwordState = observable({ value: '' });

    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }
    @action.bound passwordInputRef(ref) { this.passwordInput = ref; }

    componentDidMount() {
        if (__DEV__ && process.env.PEERIO_USERNAME && process.env.PEERIO_PASSPHRASE) {
            when(() => loginState.isConnected, () => {
                this.usernameInput.onChangeText(process.env.PEERIO_USERNAME);
                this.passwordInput.onChangeText(process.env.PEERIO_PASSPHRASE);
                process.env.PEERIO_AUTOLOGIN && this.submit();
            });
        }
    }

    @action.bound submit() {
        loginState.username = this.usernameState.value;
        loginState.passphrase = this.passwordState.value;
        uiState.hideAll()
            .then(() => loginState.login())
            .catch(e => {
                let errorMessage = 'error_wrongAK';
                if (e.deleted || e.blacklisted) {
                    errorMessage = 'error_accountSuspendedTitle';
                }
                this.passwordInput.setCustomError(tx(errorMessage));
            });
    }

    get isNextDisabled() {
        return socket.connected && (!this.passwordState.value ||
            !this.passwordInput.isValid || !this.usernameInput.isValid);
    }

    render() {
        return (
            <View style={signupStyles.page}>
                <IntroStepIndicator max={1} current={1} />
                <View style={signupStyles.container}>
                    <SignupButtonBack />
                    <SignupHeading title="title_welcomeBack" />
                    <View style={{ height: 16 }} />
                    <StyledTextInput
                        state={this.usernameState}
                        validations={usernameLogin}
                        label={tx('title_username')}
                        ref={this.usernameInputRef}
                        lowerCase
                        testID="usernameLogin"
                    />
                    <View style={{ height: 8 }} />
                    <StyledTextInput
                        state={this.passwordState}
                        label={tx('title_AccountKey')}
                        onSubmit={this.submit}
                        secureText
                        returnKeyType="go"
                        ref={this.passwordInputRef}
                        testID="usernamePassword"
                    />
                    <View style={{ height: 8 }} />
                    <View>
                        {buttons.roundBlueBgButton(
                            tx('button_login'),
                            this.submit,
                            this.isNextDisabled || loginState.isInProgress,
                            'button_login',
                            { alignSelf: 'flex-end', marginBottom: vars.spacing.small.midi2x }
                        )}
                    </View>
                    <View style={{ height: 42 }} />
                    <Text style={findKeyText}>
                        {tx('title_whereToFind')}
                    </Text>
                </View>
                <StatusBar hidden />
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
