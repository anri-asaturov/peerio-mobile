import { t } from 'peerio-translator';
import RoutedState from '../routes/routed-state';

class AccountUpgradeState extends RoutedState {
    get title() {
        return t('button_upgrade');
    }
}

export default new AccountUpgradeState();
