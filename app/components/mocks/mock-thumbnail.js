import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import Thumbnail from '../shared/thumbnail';
import buttons from '../helpers/buttons';
import FileActionSheet from '../files/file-action-sheet';
import fileState from '../files/file-state';
import { TinyDb } from '../../lib/icebear';

@observer
export default class MockThumbnail extends Component {
    async componentDidMount() {
        fileState.uploadInFiles = async selected => {
            this.path = selected.url;
            console.log(this.path);
            await TinyDb.system.setValue('mock-thumbnail', this.path);
        };
        this.path = await TinyDb.system.getValue('mock-thumbnail');
    }

    @observable path;

    showActionSheet = () => {
        FileActionSheet.show();
    };

    render() {
        const s = {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#EFEFEF'
        };
        return (
            <View style={s}>
                <View style={{ margin: 30, borderWidth: 1 }}>
                    <Thumbnail style={{ width: 180, height: 180 }} path={this.path} />
                </View>
                <View style={{ margin: 10 }}>
                    <Text>{this.path}</Text>
                </View>
                {buttons.blueBgButton('Select image', this.showActionSheet)}
            </View>
        );
    }
}
