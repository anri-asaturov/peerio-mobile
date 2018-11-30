import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import TextInputUncontrolled from '../controls/text-input-uncontrolled';

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

    setRef = ref => {
        this._ref = ref;
    };

    renderThrow() {
        return (
            <TextInputUncontrolled
                {...this.props}
                underlineColorAndroid="transparent"
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onLayout={this.onLayout}
                ref={this.setRef}
            />
        );
    }
}
