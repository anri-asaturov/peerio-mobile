import React from 'react';
import { observer } from 'mobx-react/native';
import { View, StatusBar } from 'react-native';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import { signupStyles } from '../../styles/styles';
import { telemetry } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import LoginButtonBack from './login-button-back';
import SignupHeading from '../signup/signup-heading';
import IntroStepIndicator from '../shared/intro-step-indicator';
import TmHelper from '../../telemetry/helpers';
import tm from '../../telemetry';
import LoginInputs from './login-inputs';

const { S } = telemetry;

@observer
export default class LoginClean extends SafeComponent {
    componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.SIGN_IN;
    }

    componentWillUnmount() {
        tm.login.duration(this.startTime);
    }

    render() {
        return (
            <View style={signupStyles.page}>
                <IntroStepIndicator max={1} current={1} />
                <View style={[signupStyles.container, { paddingHorizontal: signupStyles.pagePaddingLarge }]}>
                    <LoginButtonBack />
                    <SignupHeading title="title_welcomeBack" />
                    <LoginInputs />
                </View>
                <StatusBar hidden />
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
