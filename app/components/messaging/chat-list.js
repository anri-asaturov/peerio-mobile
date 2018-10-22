import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Platform } from 'react-native';
import { observable, reaction, action, computed } from 'mobx';
import { chatInviteStore, chatStore } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import ChatListItem from './chat-list-item';
import ChannelListItem from './channel-list-item';
import ProgressOverlay from '../shared/progress-overlay';
import chatState from './chat-state';
import ChatSectionHeader from './chat-section-header';
import ChannelInviteListItem from './channel-invite-list-item';
import PlusBorderIcon from '../layout/plus-border-icon';
import CreateActionSheet from './create-action-sheet';
import { tx } from '../utils/translator';
import uiState from '../layout/ui-state';
import drawerState from '../shared/drawer-state';
// import { scrollHelper } from '../helpers/test-helper';
import UnreadMessageIndicator from './unread-message-indicator';
import { vars } from '../../styles/styles';
import ChatZeroStatePlaceholder from './chat-zero-state-placeholder';
import SectionListWithDrawer from '../shared/section-list-with-drawer';
import zeroStateBeacons from '../beacons/zerostate-beacons';
import { transitionAnimation } from '../helpers/animations';

const INITIAL_LIST_SIZE = 10;

const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 100
};

@observer
export default class ChatList extends SafeComponent {
    @observable reverseRoomSorting = false;
    @observable minSectionIndex = null;
    @observable minItemIndex = null;
    @observable maxSectionIndex = null;
    @observable maxItemIndex = null;
    @observable enableIndicators = false;

    get rightIcon() {
        return (
            <PlusBorderIcon
                action={CreateActionSheet.show}
                beacon={zeroStateBeacons.startChatBeacon}
                testID="buttonCreateNewChat" />
        );
    }

    get dataSource() {
        return [
            { title: 'title_channels', index: 0, data: this.firstSectionItems },
            { title: 'title_directMessages', index: 1, data: this.secondSectionItems }
        ];
    }

    @computed get firstSectionItems() {
        const allChannels = chatStore.allRooms || [];
        allChannels.sort((a, b) => {
            const first = (a.name || a.channelName || '').toLocaleLowerCase();
            const second = (b.name || b.channelName || '').toLocaleLowerCase();
            const result = first.localeCompare(second);
            return this.reverseRoomSorting ? !result : result;
        });
        return allChannels;
    }

    @computed get secondSectionItems() {
        return chatState.store.chats.filter(d => !d.isChannel).slice();
    }

    componentDidMount() {
        uiState.testAction1 = () => {
            this.reverseRoomSorting = !this.reverseRoomSorting;
        };
        uiState.testAction2 = () => {
            const { data, index } = this.dataSource[this.dataSource.length - 1];
            this.scrollView.scrollToLocation({
                itemIndex: data.length - 1,
                sectionIndex: index,
                viewPosition: 0
            });
        };
        uiState.testAction3 = () => {
            this.scrollView.scrollToLocation({
                sectionIndex: 0,
                itemIndex: -1,
                viewOffset: vars.topDrawerHeight,
                animated: true
            });
        };

        this.indicatorReaction = reaction(() => [
            this.topIndicatorVisible,
            this.bottomIndicatorVisible
        ], transitionAnimation, { fireImmediately: true });

        setTimeout(() => {
            // TODO: unify this
            if (Platform.OS === 'android') {
                // we don't do anything here because no indicator update is an iOS problem right now
            } else {
                this.scrollView._wrapperListRef._listRef.scrollToOffset({ offset: 0 });
            }
        }, 100);
    }

    componentWillUnmount() {
        this.indicatorReaction && this.indicatorReaction();
        this.indicatorReaction = null;
        uiState.currentScrollView = null;
    }

    get sectionTitles() {
        return ['title_channels', 'title_directMessages'];
    }

    sectionHeader = (item) => {
        const { data, title } = item.section;
        const i = (t, component) => {
            const r = {};
            r[t] = component;
            return r;
        };
        const titleComponents = this.sectionTitles.map(sectionTitle => {
            return { ...i(sectionTitle, <ChatSectionHeader title={tx(sectionTitle)} />) };
        });

        const titles = Object.assign({}, ...titleComponents);
        return data && data.length ? titles[title] : null;
    };

    keyExtractor(item) {
        return item.kegDbId || item.id || item.title;
    }

    inviteItem = (chat) => <ChannelInviteListItem id={chat.kegDbId} chat={chat} channelName={chat.channelName} />;
    channelItem = (chat) => <ChannelListItem chat={chat} channelName={chat.name} />;
    dmItem = (chat) => <ChatListItem key={chat.id} chat={chat} />;

    renderChatItem = (chat) => {
        if (chat.kegDbId) return this.inviteItem(chat);
        if (chat.isChannel) return this.channelItem(chat);

        return this.dmItem(chat);
    };

    item = (item) => {
        const chat = item.item;
        if (!chat.id && !chat.kegDbId && !chat.spaceId) return null;

        return this.renderChatItem(chat);
    };

    @action.bound scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
        setTimeout(() => { this.enableIndicators = true; }, 1200);
    }

    @computed get firstUnreadItemPosition() {
        for (const { data, index } of this.dataSource) {
            const itemIndex = data.findIndex(f => !!f.unreadCount);
            if (itemIndex !== -1) return { section: index, index: itemIndex };
        }
        return null;
    }

    @computed get lastUnreadItemPosition() {
        for (let j = this.dataSource.length - 1; j >= 0; --j) {
            const { data, index } = this.dataSource[j];
            for (let i = data.length - 1; i >= 0; --i) {
                if (data[i].unreadCount) return { section: index, index: i };
            }
        }
        return null;
    }

    @computed get topIndicatorVisible() {
        if (!this.enableIndicators) return false;
        // if view hasn't been updated with viewable range
        if (this.minSectionIndex === null) return false;
        const pos = this.firstUnreadItemPosition;
        if (!pos) return false;
        if (pos.section < this.minSectionIndex) return true;
        if (pos.section === this.minSectionIndex) return pos.index < this.minItemIndex - 1;
        return false;
    }

    @computed get bottomIndicatorVisible() {
        if (!this.enableIndicators) return false;
        // if view hasn't been updated with viewable range
        if (this.maxSectionIndex === null) return false;
        const pos = this.lastUnreadItemPosition;
        if (!pos) return false;
        if (pos.section > this.maxSectionIndex) return true;
        if (pos.section === this.maxSectionIndex) return pos.index > this.maxItemIndex;
        return false;
    }

    /**
     * Scrolls to the topmost unread item in the list
     */
    @action.bound scrollUpToUnread() {
        const pos = this.firstUnreadItemPosition;
        if (!pos) return;
        this.scrollView.scrollToLocation({
            itemIndex: pos.index,
            sectionIndex: pos.section,
            viewOffset: drawerState.getDrawer() ? -vars.topDrawerHeight : 0,
            viewPosition: 0
        });
    }

    /**
     * Scrolls to the bottommost unread item in the list
     */
    @action.bound scrollDownToUnread() {
        const pos = this.lastUnreadItemPosition;
        if (!pos) return;
        this.scrollView.scrollToLocation({
            itemIndex: pos.index,
            sectionIndex: pos.section,
            viewOffset: drawerState.getDrawer() ? -vars.topDrawerHeight : 0,
            viewPosition: 0.9
        });
    }

    /**
     * Whenever there is a scroll event which changes viewable items
     * This property handler gets called
     * @param {*} data
     */
    @action.bound onViewableItemsChanged(data) {
        let minSectionIndex = Number.MAX_SAFE_INTEGER;
        let minItemIndex = Number.MAX_SAFE_INTEGER;
        let maxSectionIndex = -1;
        let maxItemIndex = -1;
        data.viewableItems.forEach(i => {
            const itemIndex = i.index;
            const sectionIndex = i.section.index;
            if (sectionIndex < minSectionIndex
                || (sectionIndex === minSectionIndex && itemIndex < minItemIndex)) {
                minSectionIndex = sectionIndex;
                // section headers have zero item index so there's a workaround
                minItemIndex = itemIndex || 0;
            }
            if (sectionIndex > maxSectionIndex
                || (sectionIndex === maxSectionIndex && itemIndex > maxItemIndex)) {
                maxSectionIndex = sectionIndex;
                // section headers have zero item index so there's a workaround
                maxItemIndex = itemIndex || 0;
            }
        });
        Object.assign(this, { minSectionIndex, minItemIndex, maxSectionIndex, maxItemIndex });
    }

    listView() {
        if (chatState.routerMain.currentIndex !== 0) return null;
        return (
            <SectionListWithDrawer
                setScrollViewRef={this.scrollViewRef}
                style={{ flexGrow: 1 }}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                renderItem={this.item}
                renderSectionHeader={this.sectionHeader}
                onEndReachedThreshold={20}
                enableEmptySections
                onViewableItemsChanged={this.onViewableItemsChanged}
                stickySectionHeadersEnabled={false}
                keyExtractor={this.keyExtractor}
                viewabilityConfig={viewabilityConfig}
            />
        );
    }

    zeroStatePlaceholder() {
        return <ChatZeroStatePlaceholder />;
    }

    renderThrow() {
        const body = ((chatStore.chats.length || chatInviteStore.received.length) && chatState.store.loaded) ?
            this.listView() : this.zeroStatePlaceholder();

        return (
            <View style={{ flexGrow: 1, flex: 1 }}>
                <View style={{ flexGrow: 1, flex: 1 }}>
                    {body}
                </View>
                {this.topIndicatorVisible && <UnreadMessageIndicator isAlignedTop action={this.scrollUpToUnread} />}
                {this.bottomIndicatorVisible && <UnreadMessageIndicator action={this.scrollDownToUnread} />}
                <ProgressOverlay enabled={chatState.store.loading} />
            </View>
        );
    }
}
