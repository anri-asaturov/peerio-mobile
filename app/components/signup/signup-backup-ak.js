import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Clipboard } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { t, tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import snackbarState from '../snackbars/snackbar-state';
import SignupGenerationBox from './signup-generation-box';
import SignupPdfPreview from './signup-pdf-preview';
import SignupHeading from './signup-heading';
import tm from '../../telemetry';
import TmHelper from '../../telemetry/helpers';
import { telemetry } from '../../lib/icebear';

const { S } = telemetry;

const buttonContainer = {
    alignItems: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

@observer
export default class SignupBackupAk extends SafeComponent {
    componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.ACCOUNT_KEY;
    }

    componentWillUnmount() {
        tm.signup.duration(this.startTime);
    }

    copyAccountKey() {
        try {
            Clipboard.setString(signupState.passphrase);
            snackbarState.pushTemporary(t('title_copied'));
            signupState.keyBackedUp = true;
            tm.signup.copyAk();
        } catch (e) {
            console.error(e);
        }
    }

    @action.bound handleNext() {
        signupState.next();
        tm.signup.navigate(S.NEXT);
    }

    @action.bound handleSkip() {
        signupState.next();
        tm.signup.navigate(S.SKIP);
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <SignupHeading title="title_backupAk" subTitle="title_generatingAkDescription" />
                    <SignupGenerationBox />
                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_copy'),
                            this.copyAccountKey,
                            null,
                            null,
                            'button_copy')}
                    </View>
                    <Text style={signupStyles.description}>
                        {tx('title_akBackupDescription')}
                    </Text>
                    <View>
                        <SignupPdfPreview />
                    </View>
                    <View style={[buttonContainer, { marginTop: 32 }]}>
                        {buttons.blueTextButton(
                            tx(signupState.keyBackedUp ? 'button_next' : 'button_skipBackup'),
                            signupState.keyBackedUp ? this.handleNext : this.handleSkip,
                            null,
                            null,
                            'button_next')}
                    </View>
                </View>
            </View>
        );
    }
}
