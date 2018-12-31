import React, { Component } from 'react';
import { SectionList, View } from 'react-native';
import { observer } from 'mobx-react/native';
import ContactInviteItem from './contact-invite-item';
import testLabel from '../helpers/test-label';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import Text from '../controls/custom-text';
import ContactCard from '../shared/contact-card';

const INITIAL_LIST_SIZE = 10;

@observer
export default class ContactSelectorSectionList extends Component {
    keyExtractor(item) {
        return item.username || item.email;
    }

    item = params => {
        const { item } = params;
        const { username, email } = item;
        if (!username) {
            return (
                <ContactInviteItem
                    contact={ContactInviteItem.fromEmail(email)}
                    backgroundColor={vars.darkBlueBackground05}
                />
            );
        }
        return (
            <View {...testLabel(params.index.toString())} accessible={false}>
                <ContactCard
                    contact={item}
                    onPress={() => this.props.onPress(item)}
                    backgroundColor={vars.darkBlueBackground05}
                />
            </View>
        );
    };

    sectionHeader({ section: { data, key } }) {
        if (!data || !data.length || !key) return null;
        const container = {
            marginLeft: vars.spacing.small.midi2x,
            justifyContent: 'center',
            height: vars.sectionHeaderHeight,
            backgroundColor: vars.darkBlueBackground05
        };
        return (
            <View style={container}>
                <Text bold>{tx(key, { found: data && data.length })}</Text>
            </View>
        );
    }

    render() {
        return (
            <SectionList
                {...testLabel('foundContacts')}
                accessible={false}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.props.dataSource}
                keyExtractor={this.keyExtractor}
                renderItem={this.item}
                renderSectionHeader={this.sectionHeader}
            />
        );
    }
}
