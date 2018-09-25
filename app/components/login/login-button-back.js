import React from 'react';
import { observer } from 'mobx-react/native';
import ButtonBack from '../shared/button-back';
import SafeComponent from '../shared/safe-component';
import loginState from './login-state';
import tm from '../../telemetry';
import { telemetry } from '../../lib/icebear';

const { S } = telemetry;

@observer
export default class LoginButtonBack extends SafeComponent {
    onBackPressed() {
        tm.login.navigate(S.BACK);
        loginState.clearLastUser();
    }

    renderThrow() {
        return <ButtonBack onBackPressed={this.onBackPressed} />;
    }
}
