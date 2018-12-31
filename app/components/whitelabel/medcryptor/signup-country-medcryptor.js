import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import MedcryptorCountryPickerBox from './medcryptor-country-picker-box';
import { vars, signupStyles } from '../../../styles/styles';
import signupState from '../../signup/signup-state';
import { tx } from '../../utils/translator';
import StyledTextInput from '../../shared/styled-text-input';
import { socket, validation } from '../../../lib/icebear';
import medcryptorUiState from './medcryptor-ui-state';
import SafeComponent from '../../shared/safe-component';
import SignupButtonBack from '../../signup/signup-button-back';
import SignupHeading from '../../signup//signup-heading';
import SignupStepIndicator from '../../signup//signup-step-indicator';
import BlueRoundButton from '../../buttons/blue-round-button';

const { validators } = validation;
const { mcrDoctorAhpraAvailability, mcrAdminAhpraAvailability, medicalIdFormat } = validators;

@observer
export default class SignupCountryMedcryptor extends SafeComponent {
    componentDidMount() {
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            medcryptorUiState.countrySelected = 'CA';
        }
    }

    validations = {
        doctor: mcrDoctorAhpraAvailability,
        admin: mcrAdminAhpraAvailability
    };

    get ahpraValidator() {
        if (medcryptorUiState.roleSelected) {
            return this.validations[medcryptorUiState.roleSelected];
        }
        return this.validations.doctor;
    }

    medicalIdState = observable({ value: '' });
    @action.bound
    medicalIdInputRef(ref) {
        this.medicalIdInput = ref;
    }

    @action.bound
    handleNextButton() {
        signupState.country = medcryptorUiState.countrySelected;
        signupState.medicalId = this.medicalIdState.value;
        signupState.next();
    }

    get selectedAU() {
        return medcryptorUiState.countrySelected === 'AU';
    }

    get isValidForAU() {
        return (
            medcryptorUiState.countrySelected &&
            this.medicalIdState.value &&
            this.medicalIdInput.isValid
        );
    }

    get isValidForNonAU() {
        return medcryptorUiState.countrySelected;
    }

    get isNextDisabled() {
        if (this.selectedAU) {
            return !(socket.connected && this.isValidForAU);
        }
        return !(socket.connected && this.isValidForNonAU);
    }

    get body() {
        return (
            <View>
                <View style={{ marginHorizontal: vars.inputMarginHorizontal }}>
                    <MedcryptorCountryPickerBox />
                </View>
                {this.selectedAU && (
                    <View>
                        <StyledTextInput
                            state={this.medicalIdState}
                            validations={[this.ahpraValidator, medicalIdFormat]}
                            label={tx('title_medicalId')}
                            lowerCase
                            returnKeyType="go"
                            required
                            ref={this.medicalIdInputRef}
                            helperText={tx('title_medicalIdDescription')}
                            testID="medicalId"
                        />
                    </View>
                )}
            </View>
        );
    }

    render() {
        return (
            <View style={signupStyles.page}>
                <SignupStepIndicator />
                <View style={signupStyles.container}>
                    <View>
                        <SignupButtonBack />
                        <SignupHeading
                            title="title_createYourAccount"
                            subTitle="mcr_title_practitionerDetails"
                        />
                        {this.body}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <BlueRoundButton
                            text="button_next"
                            accessibilityId="button_next"
                            onPress={this.handleNextButton}
                            disabled={this.isNextDisabled}
                            style={{ width: vars.signupButtonWidth, marginVertical: 30 }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
