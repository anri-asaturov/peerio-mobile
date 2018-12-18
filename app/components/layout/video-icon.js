import HeaderIconBase from './header-icon-base';
import chatState from '../messaging/chat-state';
import { popupSetupVideo } from '../shared/popups';

export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';

    // use icebear crypto to grab a random number, which can then make a random string for the jitsi link
    get jitsiLink() {
        return chatState.store.generateJitsiUrl();
    }

    get disabled() {
        // if there's no current chat or you can't send the link return true
        return !chatState.currentChat || !chatState.canSendJitsi;
    }

    // the action assigned to video icon
    action = async () => {
        // check if it's ok to post the link
        if (!this.disabled) {
            // check if you've tapped it on purpose then add jitsi link to props
            const shouldProceed = await popupSetupVideo();
            if (shouldProceed) {
                // add function as a prop which then grabs the link when called
                this.props.onAddVideoLink(this.jitsiLink);
            }
            this.disabled = true;
        }
    };
}
