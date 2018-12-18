import React from 'react';
import { observer } from 'mobx-react/native';
import { View, BackHandler } from 'react-native';
import { observable, reaction, computed } from 'mobx';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import { transitionAnimation } from '../helpers/animations';

@observer
export default class Wizard extends SafeComponent {
    @observable _index = 0;
    @observable pages = [];
    @observable pageComponents = [];
    direction = 1;

    @computed
    get currentPage() {
        const { index, pages } = this;
        return index < pages.length ? this.pageComponents[index]() : null;
    }

    get index() {
        return this._index;
    }
    set index(i) {
        this._index = i;
    }

    constructor(props) {
        super(props);
        reaction(
            () => this.index,
            () => {
                transitionAnimation();
            }
        );
    }

    _handleBack = () => {
        // TODO remove APP_LABEL condition when medcryptor sign up is up-to-date
        // disable back after account has been created
        if (process.env.APP_LABEL !== 'medcryptor' && this.index >= 3) {
            return true;
        }
        // allow back
        if (this.index > 0) {
            this.index--;
            return true;
        }
        return false;
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBack);
    }

    changeIndex(shift) {
        uiState.hideAll().then(() => {
            this.index += shift;
        });
    }

    wizard() {
        // return this.pages.map((k, i) => this._animatedContainer(k, this[k](), i));
        const container = { flexGrow: 1 };
        const component = this.currentPage;
        return <View style={container}>{component}</View>;
    }
}
