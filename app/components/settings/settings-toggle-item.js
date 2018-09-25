import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import ToggleItem from './toggle-item';
import { User } from '../../lib/icebear';

@observer
export default class SettingsToggleItem extends SafeComponent {
    get state() { return User.current.settings; }

    toggle = () => {
        const { property } = this.props;
        const value = !this.state[property];
        // so that UI reflects immediately
        this.state[property] = value;
        User.current.saveSettings(settings => {
            settings[property] = value;
        });
    };

    renderThrow() {
        return (
            <ToggleItem
                state={this.state}
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

