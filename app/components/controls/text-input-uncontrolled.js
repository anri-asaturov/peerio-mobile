import React, { Component } from 'react';
import { TextInput, Platform } from 'react-native';
import { observer } from 'mobx-react/native';
import { reaction } from 'mobx';
import { vars } from '../../styles/styles';

@observer
export default class TextInputUncontrolled extends Component {
    componentDidMount() {
        const { value } = this.props;
        if (value) {
            this.textInputRef.setNativeProps({ text: value });
        }
        this.onValueReaction = reaction(
            () => this.props.value,
            () => {
                if (!this.props.value) this.clear();
            }
        );
    }

    componentWillUnmount() {
        this.onValueReaction();
    }

    _onContentSizeChange = event => {
        const curHeight = event.nativeEvent.contentSize.height;
        if (curHeight < this.props.minHeight || curHeight > this.state.maxHeight) return;
        this.height = curHeight;
    };

    setRef = ref => {
        this.textInputRef = ref;
    };

    clear() {
        // HACK FOR CLEARING textInput in RN0.55
        // to be removed
        if (Platform.OS === 'ios') {
            this.textInputRef.setNativeProps({ text: ' ' });
        }
        requestAnimationFrame(() => {
            this.textInputRef.setNativeProps({ text: '' });
        });
    }

    focus() {
        this.textInputRef.focus();
    }

    render() {
        return (
            <TextInput
                placeholderTextColor={vars.extraSubtleText}
                underlineColorAndroid="transparent"
                {...this.props}
                ref={this.setRef}
            />
        );
    }
}
