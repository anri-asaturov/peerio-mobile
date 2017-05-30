import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { TextInput, View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class TextInputStateful extends SafeComponent {
    renderThrow() {
        const s = this.props.state;
        return (
            <View style={{ borderBottomColor: vars.bg, borderBottomWidth: 1 }}>
                <TextInput
                    testID={this.props.name}
                    style={{ height: 56, top: 0 }}
                    underlineColorAndroid={'transparent'}
                    value={s.value}
                    selectTextOnFocus
                    onChangeText={text => (s.value = text)}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    autoComplete={false}
                />
            </View>
        );
    }
}

TextInputStateful.propTypes = {
    returnKeyType: PropTypes.any,
    state: PropTypes.any.isRequired,
    name: PropTypes.string
};
