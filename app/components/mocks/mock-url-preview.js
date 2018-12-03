import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { clientApp } from '../../lib/icebear';
import InlineUrlContainer from '../messaging/inline-url-container';

const externalWebsite = {
    type: 'html',
    url: 'Https://Peerio.com',
    siteName: 'peerio.com',
    title: 'Peerio: Secure Team Communication & Cloud File Storage',
    description:
        'Secure team chat, cloud storage, and file management. All in one place, all protected from hackers and data breaches with true end-to-end encryption.',
    favicon: {
        type: 'image',
        url: 'https://peerio.com/imgs/favicons/favicon-96x96.png',
        length: 3203,
        isOverInlineSizeLimit: false,
        isOversizeCutoff: false,
        isInsecure: false
    },
    image: {
        type: 'image',
        url: 'https://www.peerio.com/imgs/logo-withtext-square.jpg',
        length: 61034,
        isOverInlineSizeLimit: false,
        isOversizeCutoff: false,
        isInsecure: false
    }
};

@observer
export default class MockUrlPreview extends Component {
    componentDidMount() {
        clientApp.uiUserPrefs.externalContentConsented = true;
    }

    render() {
        return (
            <View style={{ margin: 16 }}>
                <InlineUrlContainer externalWebsite={externalWebsite} />
            </View>
        );
    }
}
