import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import SignupContactAdd from '../contacts/contact-sync-add';
import { User } from '../../lib/icebear';

@observer
export default class MockSignupContactInvite extends Component {
    componentWillMount() {
        // for Contact constructor to work
        User.current = {
            username: 'testtest'
        };
    }

    render() {
        return (
            <SignupContactAdd />
        );
    }
}
