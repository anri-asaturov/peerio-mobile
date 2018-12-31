import { tx } from '../utils/translator';
import ActionSheetLayout from '../layout/action-sheet-layout';

export default class ChatActionSheet {
    static show(message, chat) {
        const actionButtons = [
            { title: tx('button_retry'), action: () => message.send() },
            { title: tx('button_delete'), action: () => chat.removeMessage(message) }
        ];
        ActionSheetLayout.show({
            header: null,
            actionButtons,
            hasCancelButton: true
        });
    }
}
