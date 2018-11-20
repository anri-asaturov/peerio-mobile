import React from 'react';
import { View } from 'react-native';
// import Layout1 from '../layout/layout1';
// import Layout2 from '../layout/layout2';
import LayoutSignup from '../layout/layout-signup';
import { wizard } from '../../styles/styles';
import Wizard from '../wizard/wizard';

import signupState from './signup-state';
import WhiteLabel from '../whitelabel/white-label-components';

export default class SignupWizard extends Wizard {
    pages = WhiteLabel.PAGE_NAMES;
    pageComponents = WhiteLabel.PAGE_COMPONENTS;

    get index() {
        return signupState.current;
    }
    set index(i) {
        signupState.current = i;
    }

    renderThrow() {
        const style = wizard;
        // const component = this.currentPage.type.prototype;
        const body = <View style={[style.containerFlex]}>{this.wizard()}</View>;
        return <LayoutSignup body={body} autoScroll />;
    }
}
