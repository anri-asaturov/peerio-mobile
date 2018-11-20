import React from 'react';
import { observer } from 'mobx-react/native';
import { TextInput } from 'react-native';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';

@observer
export default class SimpleTextBox extends SafeComponent {
    focus() {
        this._ref.focus();
    }

    onBlur = () => {
        uiState.focusedTextBox = null;
        if (this.props.onBlur) this.props.onBlur();
    };

    onFocus = () => {
        uiState.focusedTextBox = this._ref;
        if (this.props.onFocus) this.props.onBlur();
    };

    onLayout = () => {
        if (!this._ref.offsetY) {
            this._ref.measure((frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                this._ref.offsetY = pageY;
                this._ref.offsetHeight = frameHeight;
            });
        }
    };

    renderThrow() {
        return (
            <TextInput
                {...this.props}
                underlineColorAndroid="transparent"
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onLayout={this.onLayout}
                ref={ref => {
                    this._ref = ref;
                }}
            />
        );
    }
}
