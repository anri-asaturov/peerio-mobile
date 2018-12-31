import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { t } from '../utils/translator';
import { vars } from '../../styles/styles';
import { fileStore, chatInviteStore, chatStore } from '../../lib/icebear';
import fileState from '../files/file-state';
import routerMain from '../routes/router-main';
import uiState from './ui-state';
import { invitationState } from '../states';
import TabItem from './tab-item';
import { onboardingBeacons, dismissAllOnboardingBeacons } from '../beacons/onboarding-beacons';

const bottomRowStyle = {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: vars.darkBlueBackground15,
    height: vars.tabsHeight,
    padding: 0,
    paddingBottom: vars.iPhoneXBottom
};

@observer
export default class TabContainer extends SafeComponent {
    renderThrow() {
        if (uiState.keyboardHeight) return null;
        if (routerMain.currentIndex !== 0) return null;
        if (fileState.isFileSelectionMode) return null;
        if (invitationState.currentInvitation) return null;
        if (routerMain.route === 'contactSyncAdd' || routerMain.route === 'contactSyncInvite')
            return null;
        if (uiState.hideTabs) return null;
        return (
            <View style={bottomRowStyle}>
                <TabItem
                    text={t('title_chats')}
                    route="chats"
                    icon="forum"
                    highlightList={['space']}
                    bubble={chatStore.unreadMessages + chatInviteStore.received.length}
                    onPressTabItem={dismissAllOnboardingBeacons}
                    beacon={onboardingBeacons.chatBeacon}
                />
                <TabItem
                    text={t('title_files')}
                    route="files"
                    icon="folder"
                    bubble={fileStore.unreadFiles}
                    onPressTabItem={dismissAllOnboardingBeacons}
                    beacon={onboardingBeacons.filesBeacon}
                />
                <TabItem
                    text={t('title_contacts')}
                    route="contacts"
                    icon="people"
                    highlightList={['contactAdd', 'contactInvite']}
                    onPressTabItem={dismissAllOnboardingBeacons}
                    beacon={onboardingBeacons.contactBeacon}
                />
                <TabItem
                    text={t('title_settings')}
                    route="settings"
                    icon="settings"
                    onPressTabItem={dismissAllOnboardingBeacons}
                    beacon={onboardingBeacons.settingsBeacon}
                />
            </View>
        );
    }
}

TabContainer.propTypes = {
    height: PropTypes.any
};
