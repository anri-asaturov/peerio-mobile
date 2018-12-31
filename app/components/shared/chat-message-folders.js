import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import FolderInlineContainer from '../files/folder-inline-container';

@observer
export default class ChatMessageFolders extends SafeComponent {
    get folders() {
        const { folders, chat } = this.props;
        return folders.map(folderId => (
            <FolderInlineContainer key={folderId} folderId={folderId} chat={chat} />
        ));
    }

    renderThrow() {
        const { folders } = this.props;
        if (!folders || !folders.length) return null;
        return <View>{this.folders}</View>;
    }
}

ChatMessageFolders.propTypes = {
    folders: PropTypes.any,
    chat: PropTypes.any
};
