import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import { User, telemetry } from '../../lib/icebear';
import { uiState } from '../states';
import tm from '../../telemetry';

const { S } = telemetry;

const buttonContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

const sublocation = S.SHARE_DATA;

@observer
export default class SignupShareData extends SafeComponent {
    componentDidMount() {
        this.startTime = Date.now();
    }

    componentWillUnmount() {
        tm.signup.duration({ sublocation, startTime: this.startTime });
    }

    @action.bound
    async finishAccountCreation() {
        await signupState.finishAccountCreation();
        await signupState.finishSignUp();
        uiState.isFirstLogin = true;
    }

    @action.bound
    async handleShareButton() {
        signupState.dataCollection = true;
        await this.finishAccountCreation();
        tm.signup.shareData(true);
        tm.signup.finishSignup();
    }

    @action.bound
    async handleDeclineButton() {
        signupState.dataCollection = false;
        await this.finishAccountCreation();
        tm.signup.shareData(false);
        tm.signup.finishSignup();
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <Text semibold serif style={signupStyles.headerStyle2}>
                        {tx('title_shareUsageData')}
                    </Text>
                    <Text style={signupStyles.description}>
                        {tx('title_shareUsageDataDescription')}
                    </Text>
                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_notNow'),
                            this.handleDeclineButton,
                            User.current,
                            null,
                            'button_notNow'
                        )}
                        <View style={{ width: 24 }} />
                        {buttons.roundBlueBgButton(
                            tx('button_share'),
                            this.handleShareButton,
                            User.current,
                            'button_share'
                        )}
                    </View>
                </View>
            </View>
        );
    }
}
