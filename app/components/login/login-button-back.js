import React from 'react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import ButtonBack from '../shared/button-back';
import SafeComponent from '../shared/safe-component';
import loginState from './login-state';
import tm from '../../telemetry';

@observer
export default class LoginButtonBack extends SafeComponent {
    @action.bound
    onBackPressed() {
        tm.login.navigate(this.props.telemetry);
        loginState.clearLastUser();
    }

    renderThrow() {
        return <ButtonBack onBackPressed={this.onBackPressed} />;
    }
}

LoginButtonBack.propTypes = {
    telemetry: PropTypes.any
};
