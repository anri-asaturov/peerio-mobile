import { PAGE_NAMES, PAGE_COMPONENTS } from './signup-screens-peerio';
import LoadingScreen from '../../../components/layout/loading-screen';
import ChatList from '../../../components/messaging/chat-list';
import Chat from '../../../components/messaging/chat';
import PeerioContactAddWarning from './peerio-contact-add-warning';
import PeerioSettingsHelpButton from './peerio-settings-help-button';
import ChannelInvite from '../../messaging/channel-invite';
import PeerioManageAccountButton from './peerio-manage-account-button';

export default {
    ContactAddWarning: PeerioContactAddWarning,
    SettingsHelpButton: PeerioSettingsHelpButton,
    ManageAccountButton: PeerioManageAccountButton,
    ChatList,
    Chat,
    ChannelInvite,
    LoadingScreen,
    PAGE_NAMES,
    PAGE_COMPONENTS
};
