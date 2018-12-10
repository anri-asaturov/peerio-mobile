import React from 'react';
import { observer } from 'mobx-react/native';
import IntroStepIndicator from '../shared/intro-step-indicator';
import signupState from './signup-state';
import SafeComponent from '../shared/safe-component';
import whiteLabelConfig from '../whitelabel/white-label-config';

@observer
export default class SignupStepIndicator extends SafeComponent {
    renderThrow() {
        return (
            <IntroStepIndicator
                max={whiteLabelConfig.SIGNUP_STEP_COUNT || 3}
                current={signupState.current}
            />
        );
    }
}
