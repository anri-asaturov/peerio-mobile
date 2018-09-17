import React from 'react';
import { action, when } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import { User, telemetry } from '../../lib/icebear';
import TmHelper from '../../telemetry/helpers';
import tm from '../../telemetry';

const { S } = telemetry;

const buttonContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

@observer
export default class SignupShareData extends SafeComponent {
    componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.SHARE_DATA;
    }

    componentWillUnmount() {
        tm.signup.duration(this.startTime);
    }

    @action.bound handleShareButton() {
        // TODO: replace with icebear version after it's merged
        const { settings } = User.current;
        when(() => !settings.loading, () => {
            settings.errorTracking = true;
            settings.dataCollection = true;
            User.current.saveSettings();
        });
        tm.signup.shareData(true);
        tm.signup.finishSignup();
        signupState.finishSignUp();
    }

    @action.bound handleDeclineButton() {
        tm.signup.shareData(false);
        tm.signup.finishSignup();
        signupState.finishSignUp();
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
                            null,
                            null,
                            'button_notNow')}
                        <View style={{ width: 24 }} />
                        {buttons.roundBlueBgButton(
                            tx('button_share'),
                            this.handleShareButton,
                            null,
                            'button_share')}
                    </View>
                </View>
            </View>
        );
    }
}
