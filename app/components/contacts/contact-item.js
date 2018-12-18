import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import contactState from './contact-state';
import ContactCard from '../shared/contact-card';

@observer
export default class ContactItem extends SafeComponent {
    onPress = () => {
        const { contact, onPress } = this.props;
        if (onPress) return this.props.onPress();
        if (contact.username) return contactState.routerMain.contacts(contact);
        return contactState.routerMain.contacts(contact);
    };

    renderThrow() {
        const { contact } = this.props;
        const { username } = contact;
        const isInvited = !username;
        return (
            <ContactCard
                onPress={this.onPress}
                disableTapping={isInvited}
                contact={contact}
                invited={isInvited}
            />
        );
    }
}

ContactItem.propTypes = {
    contact: PropTypes.any.isRequired
};
