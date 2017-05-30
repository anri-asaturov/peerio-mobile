import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { vars } from '../../styles/styles';

export default class ActivityOverlay extends Component {
    render() {
        const center = {
            justifyContent: 'center',
            alignItems: 'center'
        };
        const activityOverlay = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
        return this.props.visible ? (
            <View style={[activityOverlay, center]}>
                <ActivityIndicator size={this.props.large ? 'large' : 'small'} color={vars.highlight} />
            </View>
        ) : null;
    }
}

ActivityOverlay.propTypes = {
    visible: PropTypes.any,
    large: PropTypes.any
};
