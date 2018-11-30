import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { vars } from '../../styles/styles';
import TextInputUncontrolled from './text-input-uncontrolled';

@observer
export default class AutoExpandingTextInput extends Component {
    @observable height;

    get maxHeight() {
        return this.props.maxHeight || this.props.minHeight * 3;
    }

    componentWillMount() {
        this.height = this.props.minHeight;
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
        this.textInputRef.clear();
    }

    focus() {
        this.textInputRef.focus();
    }

    render() {
        const height = Math.min(this.maxHeight, this.height);

        const style = {
            textAlign: 'left',
            padding: 0,
            fontFamily: vars.peerioFontFamily
        };

        return (
            <TextInputUncontrolled
                {...this.props}
                ref={this.setRef}
                multiline
                onContentSizeChange={this._onContentSizeChange}
                style={[style, this.props.style, { height }]}
            />
        );
    }
}

AutoExpandingTextInput.propTypes = {
    style: PropTypes.any,
    value: PropTypes.any
};
