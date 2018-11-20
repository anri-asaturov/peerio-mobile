import SnackbarBase from './snackbar-base';
import uiState from '../layout/ui-state';
import { socket } from '../../lib/icebear';
import { t } from '../utils/translator';

export default class SnackbarConnection extends SnackbarBase {
    get isVisible() {
        return uiState.appState === 'active' && !socket.connected;
    }

    // to override
    getText() {
        return socket.connected ? null : t('error_connecting');
    }

    // to override
    getShowDelay() {
        return 5000;
    }

    tap() {
        this.hide();
    }
}
