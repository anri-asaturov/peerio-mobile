import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import ToggleItem from './toggle-item';
import { User } from '../../lib/icebear';

@observer
export default class SettingsToggleItem extends SafeComponent {
    toggle = () => {
        const state = User.current.settings;
        const { property } = this.props;
        const value = !state[property];
        // so that UI reflects immediately
        state[property] = value;
        User.current.saveSettings(settings => {
            settings[property] = value;
        });
    };

    renderThrow() {
        return (
            <ToggleItem
                state={User.current.settings}
                prop={this.props.property}
                reverse={this.props.reverse}
                title={this.props.title}
                description={this.props.description}
                onPress={this.toggle}
            />
        );
    }
}

SettingsToggleItem.propTypes = {
    property: PropTypes.any.isRequired,
    title: PropTypes.any.isRequired,
    description: PropTypes.any
};
