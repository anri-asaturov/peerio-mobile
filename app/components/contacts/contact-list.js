import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { action, computed } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ContactZeroState from './contact-zero-state';
import ProgressOverlay from '../shared/progress-overlay';
import ContactItem from './contact-item';
import ContactSectionHeader from './contact-section-header';
import contactState from './contact-state';
import PlusBorderIcon from '../layout/plus-border-icon';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import uiState from '../layout/ui-state';
import SectionListWithDrawer from '../shared/section-list-with-drawer';
import ListSeparator from '../shared/list-separator';
import zeroStateBeacons from '../beacons/zerostate-beacons';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactList extends SafeComponent {
    componentDidMount() {
        contactState.store.uiViewFilter = 'all';
    }

    item({ item }) {
        return <ContactItem contact={item} />;
    }

    header({ section: /* data, */ { key } }) {
        return <ContactSectionHeader key={key} title={key} />;
    }

    @action.bound
    scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
    }

    @computed
    get sections() {
        const { addedContacts, invitedNotJoinedContacts, uiView, contacts } = contactState.store;
        const sections = uiView.map(({ letter, items }) => {
            return { data: items, key: letter };
        });
        sections.unshift({ data: [], key: `All (${contacts.length})` });
        sections.unshift({
            data: addedContacts,
            key: `${tx('title_favoriteContacts')} (${addedContacts.length})`
        });
        sections.push({
            data: invitedNotJoinedContacts,
            key: `${tx('title_invitedContacts')} (${invitedNotJoinedContacts.length})`
        });
        return sections;
    }

    listView() {
        return (
            <SectionListWithDrawer
                setScrollViewRef={this.scrollViewRef}
                ItemSeparatorComponent={ListSeparator}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.sections}
                keyExtractor={item => item.username || item.email}
                renderItem={this.item}
                renderSectionHeader={this.header}
            />
        );
    }

    get rightIcon() {
        return (
            <PlusBorderIcon
                action={contactState.fabAction}
                testID="addContactButton"
                beacon={zeroStateBeacons.addContactBeacon}
            />
        );
    }

    get contactListComponent() {
        return !contactState.empty
            ? this.listView()
            : !contactState.store.loading && <ContactZeroState />;
    }

    renderThrow() {
        return (
            <View style={{ flex: 1, flexGrow: 1, backgroundColor: vars.lightGrayBg }}>
                <View style={{ flex: 1, flexGrow: 1 }}>{this.contactListComponent}</View>
                <ProgressOverlay enabled={contactState.store.loading} />
            </View>
        );
    }
}

ContactList.propTypes = {
    store: PropTypes.any
};
