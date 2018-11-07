import React from 'react';
import PropTypes from 'prop-types';
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

const USERNAME_LABEL = 'title_username';

const findKeyText = {
    alignSelf: 'center',
    color: vars.peerioBlue,
    fontSize: vars.font.size14
};

@observer
export default class LoginInputs extends SafeComponent {
    usernameState = observable({ value: '' });
    passwordState = observable({ value: '' });

    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }
    @action.bound passwordInputRef(ref) { this.passwordInput = ref; }

    tmUsername = { ...this.props.telemetry, item: S.USERNAME };
    tmAccountKey = { ...this.props.telemetry, item: S.ACCOUNT_KEY };

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
                tm.login.onSigninButton();
                await loginState.login();
            })
            .catch(e => {
                let errorMessage = 'error_wrongAK';
                if (e.deleted || e.blacklisted) {
                    errorMessage = 'error_accountSuspendedTitle';
                }
                this.passwordInput.setCustomError(errorMessage, false);
                tm.login.onUserLoginFailed(false);
            });
    }

    get isNextDisabled() {
        return socket.connected && (!this.passwordState.value || !this.passwordInput.isValid ||
            (!this.props.hideUsernameInput && !this.usernameInput.isValid));
    }

    @action.bound
    tmEmailError(text, prevTextLength) {
        if (prevTextLength + 1 === text.length && text[text.length - 1] === '@') {
            tm.login.onLoginWithEmail(this.tmUsername, tx('error_usingEmailInUsernameField'));
        }
    }

    render() {
        const { hideUsernameInput } = this.props;
        return (
            <View>
                <View style={{ height: 16 }} />
                {!hideUsernameInput && (<View>
                    <StyledTextInput
                        state={this.usernameState}
                        telemetry={this.tmUsername}
                        validations={usernameLogin}
                        label={tx(USERNAME_LABEL)}
                        onChange={this.tmEmailError}
                        ref={this.usernameInputRef}
                        lowerCase
                        testID="usernameLogin" />
                    <View style={{ height: 8 }} />
                </View>)}
                <StyledTextInput
                    state={this.passwordState}
                    telemetry={this.tmAccountKey}
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

LoginInputs.propTypes = {
    telemetry: PropTypes.any.isRequired,
    hideUsernameInput: PropTypes.any
};
