import React from 'react';
import { observer } from 'mobx-react/native';
import signupState from './signup-state';
import SafeComponent from '../shared/safe-component';
import ButtonBack from '../shared/button-back';
import tm from '../../telemetry';
import { telemetry } from '../../lib/icebear';

const { S } = telemetry;

@observer
export default class SignupButtonBack extends SafeComponent {
    onBackPressed() {
        tm.signup.navigate(S.BACK);
        signupState.prev();
    }

    renderThrow() {
        return <ButtonBack onBackPressed={this.onBackPressed} />;
    }
}
