import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';

@observer
export default class CheckBox extends Component {
    get isChecked() {
        if (!this.props.state) {
            console.error('must specify the state to use checkbox');
            return false;
        }
        return !!this.props.state[this.props.property];
    }

    toggle() {
        if (this.props.state) {
            this.props.state[this.props.property] = !this.isChecked;
        }
        this.props.onChange && this.props.onChange();
    }

    render() {
        const { alignLeft } = this.props;
        const { isChecked } = this;
        const borderColor = isChecked ? vars.peerioBlue : 'gray';
        const backgroundColor = isChecked
            ? vars.peerioBlueBackground15
            : undefined;
        const container = {
            flexDirection: 'row',
            flexGrow: 1,
            flex: 1,
            justifyContent: alignLeft ? 'flex-start' : 'flex-end',
            alignItems: 'center',
            paddingVertical: vars.spacing.small.maxi
        };
        const checkbox = {
            borderRadius: 2,
            borderWidth: 2,
            borderColor,
            backgroundColor,
            height: 16,
            width: 16,
            marginHorizontal: vars.spacing.small.midi2x
        };
        const text = {
            color: '#000000AA',
            height: 20
        };
        return (
            <TouchableOpacity
                {...testLabel(this.props.accessibilityLabel)}
                onPress={() => this.toggle()}
                pressRetentionOffset={vars.pressRetentionOffset}>
                {alignLeft ? (
                    <View style={container}>
                        <View style={checkbox}>
                            {isChecked && (
                                <Icon name="check" color={borderColor} />
                            )}
                        </View>
                        <Text style={text}>{this.props.text}</Text>
                    </View>
                ) : (
                    <View style={container}>
                        <Text style={text}>{this.props.text}</Text>
                        <View style={checkbox}>
                            {isChecked && (
                                <Icon name="check" color={borderColor} />
                            )}
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    }
}

CheckBox.propTypes = {
    text: PropTypes.any,
    isChecked: PropTypes.bool,
    onChange: PropTypes.any,
    alignLeft: PropTypes.bool
};
