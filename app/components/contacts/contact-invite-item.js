import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { contactStore } from '../../lib/icebear';
import { tx } from '../utils/translator';
import ContactCard from '../shared/contact-card';
import BlueButtonText from '../buttons/blue-text-button';

const containerStyle = {
    flexDirection: 'row',
    alignItems: 'center'
};

const avatarComponentStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1
};

@observer
export default class ContactInviteItem extends SafeComponent {
    @observable invited = false;

    invite() {
        const { contact } = this.props;
        this.invited = true;
        contactStore.invite(contact.email);
    }

    renderThrow() {
        const { contact } = this.props;
        const invited = this.invited || contact.invited;
        const title = invited ? tx('title_invitedContacts') : tx('button_invite');
        return (
            <View style={containerStyle}>
                <View style={avatarComponentStyle}>
                    <ContactCard
                        disableTapping
                        faded={invited}
                        contact={contact}
                        invited
                        backgroundColor={this.props.backgroundColor}
                    />
                </View>
                {invited !== null && (
                    <BlueButtonText text={title} onPress={this.invite} style={{ flexShrink: 1 }} />
                )}
            </View>
        );
    }
}

ContactInviteItem.fromEmail = email => {
    return observable({ fullName: email, username: '', invited: null, email });
};

ContactInviteItem.propTypes = {
    contact: PropTypes.any.isRequired
};
