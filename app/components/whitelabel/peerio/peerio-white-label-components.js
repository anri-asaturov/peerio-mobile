import { PAGE_NAMES, PAGE_COMPONENTS } from './signup-screens-peerio';
import LoadingScreen from '../../../components/layout/loading-screen';
import ChatList from '../../../components/messaging/chat-list';
import Chat from '../../../components/messaging/chat';
import PeerioContactAddWarning from './peerio-contact-add-warning';
import ChannelInvite from '../../messaging/channel-invite';

export default {
    ContactAddWarning: PeerioContactAddWarning,
    ChatList,
    Chat,
    ChannelInvite,
    LoadingScreen,
    PAGE_NAMES,
    PAGE_COMPONENTS
};
