import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import CheckBox from '../shared/checkbox';
import SignupButtonBack from './signup-button-back';
import SignupHeading from './signup-heading';
import whiteLabelComponents from '../../components/whitelabel/white-label-components';

const { validators } = validation;
const { email } = validators;

const checkboxContainer = {
    marginBottom: vars.spacing.small.maxi
};

@observer
export default class SignupStep3 extends SafeComponent {
    emailState = observable({ value: '' });
    @action.bound emailInputRef(ref) { this.emailInput = ref; }

    componentDidMount() {
        // QUICK SIGNUP DEV FLAG
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            const rnd = new Date().getTime() % 100000;
            this.emailInput.onChangeText(`${rnd}@test`);
        }
        // fill fields when returning from another step
        if (signupState.email) {
            this.emailState.value = signupState.email;
            this.emailInput.onChangeText(this.emailState.value);
        }
    }

    @action.bound handleNextButton() {
        if (this.isNextDisabled) return;
        signupState.email = this.emailState.value;
        signupState.next();
    }

    get isNextDisabled() { return !socket.connected || !this.emailState.value || !this.emailInput.isValid; }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <whiteLabelComponents.SignupStepIndicator />
                <View style={signupStyles.container}>
                    <SignupButtonBack />
                    <SignupHeading title="title_createYourAccount" subTitle="title_whatIsYourEmail" />
                    <StyledTextInput
                        autoFocus
                        state={this.emailState}
                        validations={email}
                        label={`${tx('title_email')}*`}
                        helperText={tx('title_hintEmail')}
                        lowerCase
                        keyboardType="email-address"
                        returnKeyType="next"
                        onSubmitEditing={this.handleNextButton}
                        required
                        clearTextIcon
                        ref={this.emailInputRef}
                        testID="email" />
                    <View style={[signupStyles.separator, { marginBottom: 12 }]} />
                    <View style={checkboxContainer}>
                        <CheckBox
                            alignLeft
                            state={signupState}
                            property="subscribeToPromoEmails"
                            text={tx('title_subscribeNewsletter')}
                            accessibilityLabel={tx('title_subscribeNewsletter')} />
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        {buttons.roundBlueBgButton(
                            tx('button_create'),
                            this.handleNextButton,
                            this.isNextDisabled,
                            'button_create',
                            { width: vars.signupButtonWidth, marginVertical: 30 })}
                    </View>
                </View>
            </View>
        );
    }
}
