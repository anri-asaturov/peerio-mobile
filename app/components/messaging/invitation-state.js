import { observable } from 'mobx';
import RoutedState from '../routes/routed-state';

class InvitationState extends RoutedState {
    @observable currentInvitation;

    titleFromInvite = invite => {
        return invite ? invite.channelName : '';
    };

    get title() {
        return this.titleFromInvite(this.currentInvitation);
    }

    onTransition(active, inv) {
        if (active) {
            this.currentInvitation = inv;
        } else {
            this.currentInvitation = null;
        }
    }
}

export default new InvitationState();
