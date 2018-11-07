import React from 'react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import signupState from './signup-state';
import SafeComponent from '../shared/safe-component';
import ButtonBack from '../shared/button-back';
import tm from '../../telemetry';

@observer
export default class SignupButtonBack extends SafeComponent {
    @action.bound onBackPressed() {
        tm.signup.navigate(this.props.telemetry);
        signupState.prev();
    }

    renderThrow() {
        return <ButtonBack onBackPressed={this.onBackPressed} />;
    }
}

SignupButtonBack.propTypes = {
    telemetry: PropTypes.any
};
