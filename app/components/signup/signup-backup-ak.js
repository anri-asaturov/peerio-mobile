import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Clipboard } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { t, tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import snackbarState from '../snackbars/snackbar-state';
import SignupGenerationBox from './signup-generation-box';
import SignupPdfPreview from './signup-pdf-preview';
import SignupHeading from './signup-heading';
import tm from '../../telemetry';
import { telemetry } from '../../lib/icebear';
import BlueButtonText from '../buttons/blue-text-button';

const { S } = telemetry;

const buttonContainer = {
    alignItems: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.mini2x
};

const sublocation = S.ACCOUNT_KEY;

@observer
export default class SignupBackupAk extends SafeComponent {
    componentDidMount() {
        this.startTime = Date.now();
    }

    componentWillUnmount() {
        tm.signup.duration({ sublocation, startTime: this.startTime });
    }

    copyAccountKey() {
        try {
            Clipboard.setString(signupState.passphrase);
            snackbarState.pushTemporary(t('title_copied'));
            signupState.keyBackedUp = true;
            tm.signup.copyAk({ sublocation });
        } catch (e) {
            console.error(e);
        }
    }

    @action.bound
    handleNext() {
        signupState.next();
        tm.signup.navigate({ sublocation, option: S.NEXT });
    }

    @action.bound
    handleSkip() {
        signupState.next();
        tm.signup.navigate({ sublocation, option: S.SKIP });
    }

    renderThrow() {
        const marginTop = vars.spacing.medium.maxi2x;
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.backupAkPage}>
                    <SignupHeading
                        title="title_backupAk"
                        subTitle="title_generatingAkDescription"
                    />
                    <SignupGenerationBox />
                    <View style={buttonContainer}>
                        <BlueButtonText
                            text="button_copy"
                            onPress={this.copyAccountKey}
                            accessibilityId="button_copy"
                        />
                    </View>
                    <Text style={signupStyles.description2}>{tx('title_akBackupDescription')}</Text>
                    <View>
                        <SignupPdfPreview telemetry={{ sublocation }} />
                    </View>
                    <View style={[buttonContainer, { marginTop }]}>
                        <BlueButtonText
                            text={signupState.keyBackedUp ? 'button_next' : 'button_skipBackup'}
                            onPress={signupState.keyBackedUp ? this.handleNext : this.handleSkip}
                            accessibilityId="button_next"
                        />
                    </View>
                </View>
            </View>
        );
    }
}
