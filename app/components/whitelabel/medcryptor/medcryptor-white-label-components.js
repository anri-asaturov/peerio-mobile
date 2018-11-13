import { PAGE_NAMES, PAGE_COMPONENTS } from './signup-screens-medcryptor';
import extendRoutes from './medcryptor-router';
import MedcryptorLoadingScreen from './medcryptor-loading-screen';
import MedcryptorChatList from './medcryptor-chat-list';
import MedcryptorChat from './medcryptor-chat';
import MedcryptorContactAddWarning from './medcryptor-contact-add-warning';
import MedcryptorChannelInvite from './medcryptor-channel-invite';

export default {
    ContactAddWarning: MedcryptorContactAddWarning,
    ChatList: MedcryptorChatList,
    Chat: MedcryptorChat,
    ChannelInvite: MedcryptorChannelInvite,
    LoadingScreen: MedcryptorLoadingScreen,
    PAGE_NAMES,
    PAGE_COMPONENTS,
    extendRoutes
};
