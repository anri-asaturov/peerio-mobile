import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import FileInlineImage from '../files/file-inline-image';
import fileState from '../files/file-state';

@observer
export default class ChatMessageInlineImages extends SafeComponent {
    @computed
    get images() {
        const { message, chat } = this.props;
        const files =
            (message.files || [])
                .map(id => fileState.store.getByIdInChat(id, chat.id))
                .filter(f => f) || [];

        const images = files.filter(f => f.isImage) || [];

        if (message.hasUrls && message.externalImages.length) {
            images.push(...message.externalImages);
        }

        return images;
    }

    get renderImages() {
        const { onInlineImageAction, onLegacyFileAction } = this.props;

        return this.images.map(image => {
            const key = image.fileId || image.url;
            return (
                <FileInlineImage
                    {...{ key, image, onLegacyFileAction }}
                    onAction={onInlineImageAction}
                />
            );
        });
    }

    renderThrow() {
        if (!this.images.length) return null;

        return <View>{this.renderImages}</View>;
    }
}

ChatMessageInlineImages.propTypes = {
    message: PropTypes.any,
    chat: PropTypes.any,
    onInlineImageAction: PropTypes.any,
    onLegacyFileAction: PropTypes.any
};
