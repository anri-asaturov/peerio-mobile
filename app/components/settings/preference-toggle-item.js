import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import ToggleItem from './toggle-item';
import preferenceStore from './preference-store';

const state = preferenceStore.prefs;

@observer
export default class PreferenceToggleItem extends SafeComponent {
    toggle = () => {
        state[this.props.property] = !state[this.props.property];
    };

    renderThrow() {
        return (
            <ToggleItem
                state={state}
                prop={this.props.property}
                reverse={this.props.reverse}
                title={this.props.title}
                description={this.props.description}
                onPress={this.toggle}
            />
        );
    }
}

PreferenceToggleItem.propTypes = {
    property: PropTypes.any.isRequired,
    title: PropTypes.any.isRequired,
    description: PropTypes.any
};
