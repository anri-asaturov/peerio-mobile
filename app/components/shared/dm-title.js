import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';

const fullnameTextStyle = {
    color: vars.txtDark,
    fontSize: vars.font.size14
};

const usernameTextStyle = {
    color: vars.txtMedium,
    fontSize: vars.font.size14,
    fontWeight: 'normal'
};

@observer
export default class DmTitle extends SafeComponent {
    renderThrow() {
        const { contact, unread } = this.props;
        return (
            <Text ellipsizeMode="tail" numberOfLines={1}>
                <Text style={fullnameTextStyle} semibold={unread}>
                    {contact.fullName}
                </Text>
                {` `}
                <Text style={usernameTextStyle} semibold={unread} italic>
                    {contact.username}
                </Text>
            </Text>
        );
    }
}

DmTitle.propTypes = {
    contact: PropTypes.any,
    unread: PropTypes.any
};
