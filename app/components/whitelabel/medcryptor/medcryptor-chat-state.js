import { tx } from '../../utils/translator';
import { chatState } from '../../states';
import { chatStore } from '../../../lib/icebear';

chatState.titleFromChat = (chat, defaultName) => {
    if (chatState.spaceOpen) return chatStore.spaces.currentSpaceName;
    if (defaultName) return tx('title_chats');
    if (chatStore.spaces.isInternalRoomOpen)
        return `${chatStore.activeChat.nameInSpace} (${tx('mcr_title_internal')})`;
    if (chatStore.spaces.isPatientRoomOpen)
        return `${chatStore.activeChat.nameInSpace} (${tx('mcr_title_patient')})`;

    return chat ? chat.name : '';
};

export default chatState;
