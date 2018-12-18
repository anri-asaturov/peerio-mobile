import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import AvatarCircle from './avatar-circle';
import DeletedCircle from './deleted-circle';
import contactState from '../contacts/contact-state';

@observer
export default class TouchableContactAvatar extends SafeComponent {
    @action.bound
    onPress() {
        const { contact } = this.props;
        contactState.contactView(contact);
    }

    renderThrow() {
        const { contact } = this.props;
        return (
            <TouchableOpacity
                style={{ alignSelf: 'flex-start' }}
                pressRetentionOffset={vars.retentionOffset}
                onPress={this.onPress}>
                <AvatarCircle contact={contact} loading={contact.loading} />
                <DeletedCircle visible={contact.isDeleted} />
            </TouchableOpacity>
        );
    }
}

TouchableContactAvatar.propTypes = {
    contact: PropTypes.any
};
