import { observer } from 'mobx-react/native';
import SnackbarBase from './snackbar-base';
import snackbarState from './snackbar-state';
import { socket } from '../../lib/icebear';
import { t } from '../utils/translator';

@observer
export default class SnackbarConnection extends SnackbarBase {
    // to override
    getText() {
        return socket.connected ? null : t('snackbar_connection');
    }

    // to override
    getShowDelay() {
        return 500;
    }

    tap() {
        this.hide(() => snackbarState.pop());
    }
}
