import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../../shared/safe-component';
import { t } from '../../utils/translator';
import { vars } from '../../../styles/styles';
import { fileStore, chatInviteStore, chatStore } from '../../../lib/icebear';
import fileState from '../../files/file-state';
import routerMain from '../../routes/router-main';
import uiState from '../../layout/ui-state';
import { invitationState } from '../../states';
import TabItem from '../../layout/tab-item';
import mockTabBeacons from './mock-tab-beacons';

@observer
export default class MockTabContainer extends SafeComponent {
    renderThrow() {
        if (uiState.keyboardHeight) return null;
        if (routerMain.currentIndex !== 0) return null;
        if (fileState.isFileSelectionMode) return null;
        if (invitationState.currentInvitation) return null;
        if (uiState.hideTabs) return null;
        const bottomRowStyle = {
            flexShrink: 1,
            flexDirection: this.props.vertical ? null : 'row',
            backgroundColor: vars.darkBlueBackground15,
            height: this.props.vertical ? null : vars.tabsHeight,
            width: this.props.vertical ? vars.tabsHeight : null,
            padding: 0,
            paddingBottom: vars.iPhoneXBottom
        };
        return (
            <View style={bottomRowStyle}>
                <TabItem
                    text={t('title_chats')}
                    route="chats"
                    icon="forum"
                    highlightList={['space']}
                    bubble={chatStore.unreadMessages + chatInviteStore.received.length}
                    beacon={mockTabBeacons.chatBeacon}
                />
                <TabItem
                    text={t('title_files')}
                    route="files"
                    icon="folder"
                    bubble={fileStore.unreadFiles}
                    beacon={mockTabBeacons.filesBeacon}
                />
                <TabItem
                    text={t('title_contacts')}
                    route="contacts"
                    icon="people"
                    highlightList={['contactAdd', 'contactInvite']}
                    beacon={mockTabBeacons.contactBeacon}
                />
                <TabItem
                    text={t('title_settings')}
                    route="settings"
                    icon="settings"
                    beacon={mockTabBeacons.settingsBeacon}
                />
            </View>
        );
    }
}

MockTabContainer.propTypes = {
    height: PropTypes.any,
    vertical: PropTypes.bool
};
