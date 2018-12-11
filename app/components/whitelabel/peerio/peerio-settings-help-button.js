import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../../shared/safe-component';
import BasicSettingsItem from '../../settings/basic-settings-item';

@observer
export default class PeerioSettingsHelpButton extends SafeComponent {
    renderThrow() {
        const { title, untappable } = this.props;
        return (
            <BasicSettingsItem title={title} untappable={untappable}>
                {this.props.children}
            </BasicSettingsItem>
        );
    }
}
