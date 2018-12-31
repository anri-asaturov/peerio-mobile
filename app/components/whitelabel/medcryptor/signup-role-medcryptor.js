import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import MedcryptorSpecialtyPickerBox from './medcryptor-specialty-picker-box';
import MedcryptorRolePickerBox from './medcryptor-role-picker-box';
import { vars, signupStyles } from '../../../styles/styles';
import signupState from '../../signup/signup-state';
import { socket } from '../../../lib/icebear';
import medcryptorUiState from './medcryptor-ui-state';
import SafeComponent from '../../shared/safe-component';
import SignupButtonBack from '../../signup/signup-button-back';
import SignupHeading from '../../signup/signup-heading';
import SignupStepIndicator from '../../signup/signup-step-indicator';
import BlueRoundButton from '../../buttons/blue-round-button';

@observer
export default class SignupRoleMedcryptor extends SafeComponent {
    componentDidMount() {
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            medcryptorUiState.roleSelected = 'admin';
        }
    }

    @action.bound
    handleNextButton() {
        signupState.specialty = medcryptorUiState.specialtySelected;
        signupState.role = medcryptorUiState.roleSelected;
        signupState.next();
    }

    get selectedAU() {
        return medcryptorUiState.countrySelected === 'AU';
    }

    get isValidForAU() {
        return medcryptorUiState.specialtySelected && medcryptorUiState.roleSelected;
    }

    get isValidForNonAU() {
        return medcryptorUiState.roleSelected;
    }

    get isNextDisabled() {
        if (this.selectedAU) {
            return !(socket.connected && this.isValidForAU);
        }
        return !(socket.connected && this.isValidForNonAU);
    }

    get body() {
        return (
            <View style={{ marginHorizontal: vars.inputMarginHorizontal }}>
                {this.selectedAU && <MedcryptorSpecialtyPickerBox />}
                <MedcryptorRolePickerBox />
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
