import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import ContactSelectorUserBox from './contact-selector-userbox';

@observer
export default class ContactSelectorUserBoxLine extends Component {
    render() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: this.props.contacts ? vars.spacing.small.mini2x : 0,
            paddingLeft: vars.spacing.medium.mini2x,
            flexWrap: 'wrap'
        };
        const boxes = this.props.contacts.map((contact, i) => (
            <ContactSelectorUserBox
                contact={contact}
                key={i}
                onPress={() => this.props.onPress(contact)}
            />
        ));
        return <View style={container}>{boxes}</View>;
    }
}
