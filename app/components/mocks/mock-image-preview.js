import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import PopupLayout from '../layout/popup-layout';
import ModalLayout from '../layout/modal-layout';
import FileSharePreview from '../files/file-share-preview';
import mockStoresCreate from './mock-stores-create';

@observer
export default class MockImagePreview extends Component {
    componentWillMount() {
        const path =
            '/Users/seavan/Library/Developer/CoreSimulator/Devices/BEEBFAB7-125B-469D-923B-AAF5EB5E47D5/data/Containers/Data/Application/FFE08229-965D-4B1C-8D19-0FF74E7BFE37/Library/Caches/cache/d73b44ad8eea613e8a5d55aebc04d3fc.jpg';
        const fileName = 'image-001.jpg';
        mockStoresCreate();
        FileSharePreview.popup(path, fileName);
        // setTimeout(() => routes.modal.changeRecipient(), 1000);
    }

    render() {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                    flexGrow: 1,
                    paddingTop: vars.layoutPaddingTop
                }}>
                <PopupLayout />
                <ModalLayout />
                {/* <StatusBar barStyle="default" /> */}
            </View>
        );
    }
}
