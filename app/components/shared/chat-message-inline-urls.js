import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from './safe-component';
import InlineUrlContainer from '../messaging/inline-url-container';

@observer
export default class ChatMessageInlineUrls extends SafeComponent {
    renderThrow() {
        const { message } = this.props;
        const { externalWebsites } = message;
        if (!externalWebsites.length) return null;

        return externalWebsites.map(externalWebsite => {
            return (
                <InlineUrlContainer
                    key={externalWebsite}
                    externalWebsite={externalWebsite}
                    isClosed={this.props.isClosed}
                />
            );
        });
    }
}

ChatMessageInlineUrls.propTypes = {
    message: PropTypes.any
};
