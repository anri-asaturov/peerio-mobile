import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import TwoFactorAuth from './two-factor-auth';
import Display from './display';
import Notifications from './notifications';
import settingsState from './settings-state';
import Logs from '../logs/logs';

@observer
export default class SettingsLevel3 extends SafeComponent {
    twoFactorAuth = () => <TwoFactorAuth />;

    display = () => <Display />;

    notifications = () => <Notifications />;

    logs = () => <Logs />;

    renderThrow() {
        const component = this[settingsState.subroute];
        return component && component();
    }
}
