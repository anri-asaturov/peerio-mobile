import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { contactStore } from '../../lib/icebear';
import ContactCard from '../shared/contact-card';

@observer
export default class ContactLegacyItem extends SafeComponent {
    invite() {
        const { contact } = this.props;
        contact.invited = true;
        contactStore.invite(contact.email);
    }

    renderThrow() {
        const { contact } = this.props;
        return <ContactCard faded={contact.invited} contact={contact} />;
    }
}

ContactLegacyItem.propTypes = {
    contact: PropTypes.any.isRequired
};
