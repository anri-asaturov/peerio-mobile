import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Platform } from 'react-native';
import { observable, reaction, action, computed } from 'mobx';
import { chatInviteStore } from '../../lib/icebear';
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
import FlatListWithDrawer from '../shared/flat-list-with-drawer';
import zeroStateBeacons from '../beacons/zerostate-beacons';
import { transitionAnimation } from '../helpers/animations';

const INITIAL_LIST_SIZE = 10;

const viewabilityConfig = {
    itemVisiblePercentThreshold: 40
};

@observer
export default class ChatList extends SafeComponent {
    @observable reverseRoomSorting = false;
    @observable minItemIndex = null;
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

    @computed get dataSource() {
        const addSection = (sectionTitle, items) => {
            if (!items || !items.length) return [];
            return [
                [{ sectionTitle }],
                items
            ];
        };
        return [].concat(
            ...addSection('title_channels', this.firstSectionItems),
            ...addSection('title_directMessages', this.secondSectionItems)
        );
    }

    @computed get firstSectionItems() {
        const allChannels = chatState.store.allRooms.filter(c => c.headLoaded) || [];
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
            } else if (this.scrollView && this.scrollView._wrapperListRef) {
                this.scrollView._wrapperListRef._listRef.scrollToOffset({ offset: 0 });
            }
        }, 100);
    }

    componentWillUnmount() {
        this.indicatorReaction && this.indicatorReaction();
        this.indicatorReaction = null;
        uiState.currentScrollView = null;
    }

    keyExtractor(item) {
        return item.kegDbId || item.id || item.sectionTitle;
    }

    inviteItem = (chat) => <ChannelInviteListItem id={chat.kegDbId} chat={chat} channelName={chat.channelName} />;
    channelItem = (chat) => <ChannelListItem chat={chat} channelName={chat.name} />;
    dmItem = (chat) => <ChatListItem height={vars.listItemHeight} key={chat.id} chat={chat} />;
    renderListItem = (item) => {
        if (item.kegDbId) return this.inviteItem(item);
        if (item.isChannel) return this.channelItem(item);
        if (item.sectionTitle) return <ChatSectionHeader title={tx(item.sectionTitle)} />;

        return this.dmItem(item);
    };

    item = (item) => {
        const chat = item.item;
        if (!chat.id && !chat.kegDbId && !chat.spaceId && !chat.sectionTitle) return null;

        return this.renderListItem(chat);
    };

    getItemLayout = (data, index) => {
        let offset = 0;
        const { firstSectionItems, secondSectionItems } = this;
        // first item is a section header
        const firstSectionLength = firstSectionItems.length ?
            firstSectionItems.length + 1 : 0;
        // first section
        if (firstSectionLength) {
            offset += Math.min(index, firstSectionLength) * vars.sectionHeaderHeight;
        }
        // first item is a section header
        const secondSectionLength = secondSectionItems.length ?
            secondSectionItems.length + 1 : 0;
        if (secondSectionLength) {
            if (index > firstSectionLength) {
                offset += vars.sectionHeaderHeight;
            }
            offset += Math.max(0, index - 1 - firstSectionLength) * vars.listItemHeight;
        }

        const length = index > firstSectionLength ? vars.listItemHeight : vars.sectionHeaderHeight;
        return {
            length,
            offset,
            index
        };
    };

    @action.bound scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
        this.enableIndicators = true;
        // setTimeout(() => { this.enableIndicators = true; }, 1200);
    }

    @computed get firstUnreadItem() {
        for (let index = 0; index < this.dataSource.length; ++index) {
            const item = this.dataSource[index];
            if (item.unreadCount) return { item, index };
        }
        return null;
    }

    @computed get lastUnreadItem() {
        for (let index = this.dataSource.length - 1; index >= 0; --index) {
            const item = this.dataSource[index];
            if (item.unreadCount) return { item, index };
        }
        return null;
    }

    @computed get topIndicatorVisible() {
        if (!this.enableIndicators) return false;
        // if view hasn't been updated with viewable range
        if (this.minItemIndex === null) return false;
        const pos = this.firstUnreadItem;
        if (!pos) return false;
        return pos.index < this.minItemIndex;
    }

    @computed get bottomIndicatorVisible() {
        if (!this.enableIndicators) return false;
        // if view hasn't been updated with viewable range
        if (this.maxItemIndex === null) return false;
        const pos = this.lastUnreadItem;
        if (!pos) return false;
        return pos.index > this.maxItemIndex;
    }

    /**
     * Scrolls to the topmost unread item in the list
     */
    @action.bound scrollUpToUnread() {
        const pos = this.firstUnreadItem;
        if (!pos) return;
        this.scrollView.scrollToIndex({
            index: pos.index,
            viewOffset: drawerState.getDrawer() ? -vars.topDrawerHeight : 0,
            viewPosition: 0
        });
    }

    /**
     * Scrolls to the bottommost unread item in the list
     */
    @action.bound scrollDownToUnread() {
        const pos = this.lastUnreadItem;
        if (!pos) return;
        this.scrollView.scrollToIndex({
            index: pos.index,
            viewOffset: drawerState.getDrawer() ? -vars.topDrawerHeight : 0,
            viewPosition: 1
        });
    }

    /**
     * Whenever there is a scroll event which changes viewable items
     * This property handler gets called
     * @param {*} data
     */
    @action.bound onViewableItemsChanged(info) {
        const { viewableItems } = info;
        let minItemIndex = this.dataSource.length;
        let maxItemIndex = 0;
        viewableItems.forEach(i => {
            const itemIndex = i.index;
            minItemIndex = Math.min(minItemIndex, itemIndex);
            maxItemIndex = Math.max(maxItemIndex, itemIndex);
        });
        // console.log(`viewability changed: min: ${minItemIndex}, max: ${maxItemIndex}`);
        Object.assign(this, { minItemIndex, maxItemIndex });
    }

    get listView() {
        if (chatState.routerMain.currentIndex !== 0) return null;
        return (
            <FlatListWithDrawer
                setScrollViewRef={this.scrollViewRef}
                style={{ flexGrow: 1 }}
                initialNumToRender={INITIAL_LIST_SIZE}
                data={this.dataSource}
                renderItem={this.item}
                keyExtractor={this.keyExtractor}
                onViewableItemsChanged={this.onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={this.getItemLayout}
            />
        );
    }

    renderThrow() {
        const body = ((chatState.store.chats.length || chatInviteStore.received.length) && chatState.store.loaded) ?
            this.listView : <ChatZeroStatePlaceholder />;

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
