import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';

@observer
export default class GrayLabel extends SafeComponent {
    adminTextStyle = {
        color: vars.subtleText,
        fontSize: vars.font.size11
    };

    adminContainerStyle = {
        backgroundColor: vars.adminBadgeColor,
        borderRadius: 4,
        paddingHorizontal: vars.spacing.small.mini2x,
        paddingVertical: vars.spacing.small.mini,
        overflow: 'hidden'
    };

    renderThrow() {
        const { label } = this.props;
        return (
            <View style={this.adminContainerStyle}>
                <Text semibold style={this.adminTextStyle}>
                    {tx(label)}
                </Text>
            </View>);
    }
}

GrayLabel.propTypes = {
    label: PropTypes.any.isRequired
};
