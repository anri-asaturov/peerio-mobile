import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';

const overlay = {
    //    backgroundColor: '#00000020',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};

@observer
export default class ProgressOverlay extends SafeComponent {
    renderThrow() {
        if (!this.props.enabled) return null;
        return (
            <View style={overlay}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

ProgressOverlay.propTypes = {
    enabled: PropTypes.bool
};
