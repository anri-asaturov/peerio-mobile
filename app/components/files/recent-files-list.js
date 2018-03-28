import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { SectionList, View } from 'react-native';
import { reaction, action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import chatState from '../messaging/chat-state';
import ChatInfoSectionHeader from '../messaging/chat-info-section-header';
import RecentFileItem from '../files/recent-file-item';
import FilesActionSheet from '../files/files-action-sheet';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 25;

@observer
export default class RecentFilesList extends SafeComponent {
    dataSource = [];

    get data() { return chatState.currentChat.recentFiles; }

    get hasData() { return this.dataSource[0] && this.dataSource[0].data.length; }

    // TODO Test after new FS is implemented
    @action.bound refreshData() {
        const newData = this.data;
        this.dataSource = [{ data: newData.slice(), key: tx('title_recentFiles') }];
        this.forceUpdate();
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data,
            this.data.length
        ], () => {
            this.dataSource = [{ data: this.data.slice(), key: tx('title_recentFiles') }];
            this.forceUpdate();
        }, true);
    }

    item = ({ item }) => {
        const collapsible = chatState.currentChat.isChannel;
        const isCollapsed = !chatState.collapseFirstChannelInfoList;
        if (collapsible && isCollapsed) return null;
        const fileId = item;
        const file = fileState.store.getByIdInChat(fileId, chatState.currentChat.id);
        if (!file) return null;
        // TODO: replace with getOrMake pattern
        // for event handler
        return (
            <RecentFileItem
                onMenu={() => FilesActionSheet.show(file)}
                key={fileId}
                file={file} />
        );
    };

    header = ({ section: { key } }) => {
        const { collapsed, toggleCollapsed } = this.props;
        return (<ChatInfoSectionHeader
            key={key}
            title={key}
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
            hidden={!this.hasData} />);
    };

    renderThrow() {
        return (
            <View>
                <SectionList
                    initialNumToRender={INITIAL_LIST_SIZE}
                    sections={this.dataSource}
                    keyExtractor={fileId => fileId}
                    renderItem={this.item}
                    renderSectionHeader={this.header}
                    style={{ marginBottom: 8 }}
                />
            </View>
        );
    }
}

RecentFilesList.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    toggleCollapsed: PropTypes.func
};
