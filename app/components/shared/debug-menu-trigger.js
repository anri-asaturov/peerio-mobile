import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { TouchableWithoutFeedback } from 'react-native';
import uiState from '../layout/ui-state';

@observer
export default class DebugMenuTrigger extends Component {
    countDebugPress = 0;

    handleTitlePress() {
        this.countDebugPress++;
        if (this.countDebugPress >= 10) {
            uiState.showDebugMenu = true;
        }
    }

    render () {
        return (
            <TouchableWithoutFeedback onPress={() => this.handleTitlePress()}>
                {this.props.children}
            </TouchableWithoutFeedback>
        );
    }
}

