import React from 'react';
import { observable, action, reaction, when } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import randomWords from 'random-words';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation, telemetry, config } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import SignupButtonBack from './signup-button-back';
import SignupHeading from './signup-heading';
import SignupStepIndicator from './signup-step-indicator';
import tm from '../../telemetry';
import { transitionAnimation } from '../helpers/animations';

const { S } = telemetry;

const { validators } = validation;
const { username } = validators;

const MAX_USERNAME_LENGTH = config.user.maxUsernameLength;

const sublocation = S.ACCOUNT_USERNAME;

const tmUsername = {
    item: S.USERNAME,
    location: S.ONBOARDING,
    sublocation
};

const suggestionContainerHeight = signupStyles.suggestionContainer.maxHeight;

@observer
export default class SignupStep2 extends SafeComponent {
    // used for telemetry option to know if user autofilled username before or after getting error
    errorFlag = S.FIRST;

    usernameState = observable({ value: '' });

    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }

    componentDidMount() {
        this.startTime = Date.now();
        // QUICK SIGNUP DEV FLAG
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            this.usernameInput.onChangeText(randomWords({ min: 2, max: 2, join: 'o' }).substring(0, 16));
        }
        // fill fields when returning from another step
        if (signupState.username) {
            this.usernameState.value = signupState.username;
            this.usernameInput.onChangeText(this.usernameState.value);
        }

        this.suggestionAnimationReaction = reaction(
            () => signupState.usernameSuggestions,
            transitionAnimation
        );
        signupState.suggestUsernames();

        when(() => this.usernameInput.valid === false, () => {
            this.errorFlag = S.SECOND;
        });
    }

    componentWillUnmount() {
        this.suggestionAnimationReaction();
        tm.signup.duration({ sublocation, startTime: this.startTime });
    }

    @action.bound handleNextButton() {
        if (this.isNextDisabled) return;
        signupState.username = this.usernameState.value;
        signupState.next();
        tm.signup.navigate({ sublocation, option: S.NEXT });
    }

    get isNextDisabled() { return !socket.connected || !this.usernameState.value || !this.usernameInput.isValid; }

    @action.bound fillField(suggestion) {
        this.usernameState.value = suggestion;
        this.usernameInput.onChangeText(this.usernameState.value);
        tm.signup.pickUsername(this.errorFlag);
    }

    suggestionPill = (suggestion) => {
        if (!suggestion) return null;
        const style = {
            minWidth: 48,
            height: 21,
            borderColor: vars.peerioPurple,
            borderWidth: 1,
            borderRadius: 16,
            marginRight: vars.spacing.small.midi2x,
            marginBottom: vars.spacing.small.midi,
            paddingHorizontal: vars.spacing.small.midi,
            alignItems: 'center'
        };
        const textStyle = {
            color: vars.peerioPurple,
            backgroundColor: 'transparent',
            fontSize: vars.font.size14
        };

        return (
            <TouchableOpacity
                key={suggestion}
                pressRetentionOffset={vars.retentionOffset}
                onPress={() => this.fillField(suggestion)}>
                <View style={style}>
                    <Text style={textStyle}>{suggestion}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    get suggestionBlock() {
        const suggestionTitle = this.usernameInput && this.usernameInput.errorMessageText === 'error_usernameNotAvailable' ?
            tx('title_try') : tx('title_available');
        const suggestionBox = !signupState.usernameSuggestions.length ? null :
            (<View style={{ height: suggestionContainerHeight, flexDirection: 'row' }}>
                <View>
                    <Text style={signupStyles.suggestionTitle}>{suggestionTitle}</Text>
                </View>
                <View style={signupStyles.suggestionContainer}>
                    {signupState.usernameSuggestions.map(this.suggestionPill)}
                </View>
            </View>);

        return (
            <View>
                <View style={{ height: suggestionContainerHeight + 48 }}>
                    {suggestionBox}
                    <View style={{ alignItems: 'flex-end' }}>
                        {buttons.roundBlueBgButton(
                            tx('button_next'),
                            this.handleNextButton,
                            this.isNextDisabled,
                            'button_next',
                            { width: vars.signupButtonWidth })}
                    </View>
                </View>
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <SignupStepIndicator />
                <View style={signupStyles.container}>
                    <SignupButtonBack telemetry={{ sublocation, option: S.BACK }} />
                    <SignupHeading title="title_createYourAccount" subTitle="title_usernameHeading" />
                    <StyledTextInput
                        autoFocus
                        state={this.usernameState}
                        validations={username}
                        telemetry={tmUsername}
                        helperText={this.usernameState.value.length >= MAX_USERNAME_LENGTH ?
                            tx('title_characterLimitReached') :
                            tx('title_hintUsername')}
                        maxLength={MAX_USERNAME_LENGTH}
                        label={`${tx('title_username')}*`}
                        lowerCase
                        required
                        clearTextIcon
                        keyboardType="email-address"
                        returnKeyType="next"
                        onSubmitEditing={this.handleNextButton}
                        ref={this.usernameInputRef}
                        testID="username" />
                    <View style={signupStyles.separator} />
                    {this.suggestionBlock}
                </View>
            </View>
        );
    }
}
