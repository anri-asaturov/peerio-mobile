import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import AccountUpgradeOffer from '../settings/account-upgrade-offer';

@observer
export default class MockUpgrade extends Component {
    render() {
        return <AccountUpgradeOffer />;
    }
}
