import { invitationState } from '../../states';
import { tx } from '../../utils/translator';

invitationState.titleFromInvite = invite => {
    let title = '';
    if (invite) {
        if (invite.isInSpace) {
            if (invite.chatHead.spaceRoomType === 'patient') {
                title = `${invite.chatHead.nameInSpace} (${tx('mcr_title_patient')})`;
            } else {
                title = `${invite.chatHead.nameInSpace} (${tx('mcr_title_internal')})`;
            }
        } else {
            title = invite.channelName;
        }
    }
    return title;
};

export default invitationState;
