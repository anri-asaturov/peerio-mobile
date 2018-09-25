import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { observable, action, when } from 'mobx';
import { tx } from '../utils/translator';
import loginState from './login-state';
import { vars } from '../../styles/styles';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation, telemetry, User } from '../../lib/icebear';
import uiState from '../layout/ui-state';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import Text from '../controls/custom-text';
import tm from '../../telemetry';

const { S } = telemetry;

const { validators } = validation;
const { usernameLogin } = validators;

const findKeyText = {
    alignSelf: 'center',
    color: vars.peerioBlue,
    fontSize: vars.font.size.normal
};

@observer
export default class LoginInputs extends SafeComponent {
    usernameState = observable({ value: '' });
    passwordState = observable({ value: '' });

    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }
    @action.bound passwordInputRef(ref) { this.passwordInput = ref; }

    async componentDidMount() {
        const { hideUsernameInput } = this.props;
        if (hideUsernameInput) {
            const user = await User.getLastAuthenticated();
            this.usernameState.value = user.username;
        }
        if (__DEV__ && process.env.PEERIO_USERNAME && process.env.PEERIO_PASSPHRASE) {
            when(() => loginState.isConnected, () => {
                this.usernameInput && this.usernameInput.onChangeText(process.env.PEERIO_USERNAME);
                this.passwordInput && this.passwordInput.onChangeText(process.env.PEERIO_PASSPHRASE);
                process.env.PEERIO_AUTOLOGIN && this.submit();
            });
        }
    }

    @action.bound submit() {
        loginState.username = this.usernameState.value;
        loginState.passphrase = this.passwordState.value;
        uiState.hideAll()
            .then(async () => {
                await loginState.login();
                tm.login.onLoginSuccess();
            })
            .catch(e => {
                let errorMessage = 'error_wrongAK';
                if (e.deleted || e.blacklisted) {
                    errorMessage = 'error_accountSuspendedTitle';
                }
                this.passwordInput.setCustomError(errorMessage);
            });
    }

    get isNextDisabled() {
        return socket.connected && (!this.passwordState.value || !this.passwordInput.isValid ||
            (!this.props.hideUsernameInput && !this.usernameInput.isValid));
    }

    render() {
        const { hideUsernameInput } = this.props;
        return (
            <View>
                <View style={{ height: 16 }} />
                {!hideUsernameInput && (<View>
                    <StyledTextInput
                        state={this.usernameState}
                        inputName={S.USERNAME}
                        validations={usernameLogin}
                        label={tx('title_username')}
                        tmTrackEmailError
                        ref={this.usernameInputRef}
                        lowerCase
                        testID="usernameLogin" />
                    <View style={{ height: 8 }} />
                </View>)}
                <StyledTextInput
                    state={this.passwordState}
                    inputName={S.ACCOUNT_KEY}
                    label={tx('title_AccountKey')}
                    onSubmit={this.submit}
                    secureText
                    returnKeyType="go"
                    ref={this.passwordInputRef}
                    testID="usernamePassword" />
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
        );
    }
}
