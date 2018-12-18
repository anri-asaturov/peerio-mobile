import React from 'react';
import { observer } from 'mobx-react/native';
import { Linking } from 'react-native';
import SafeComponent from '../../shared/safe-component';
import SettingsItem from '../../settings/settings-item';
import { tx } from '../../utils/translator';
import { config } from '../../../lib/icebear';

@observer
export default class PeerioManageAccountButton extends SafeComponent {
    renderThrow() {
        const { leftComponent } = this.props;
        return (
            <SettingsItem
                title={tx('title_manage')}
                onPress={() => Linking.openURL(config.translator.urlMap.manageSubscription.link)}
                leftComponent={leftComponent}
            />
        );
    }
}
