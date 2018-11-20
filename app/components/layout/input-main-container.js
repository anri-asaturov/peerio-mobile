import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import InputMain from './input-main';
import chatState from '../messaging/chat-state';
import FileUploadProgress from '../files/file-upload-progress';
import FileUploadActionSheet from '../files/file-upload-action-sheet';
import { vars } from '../../styles/styles';

@observer
export default class InputMainContainer extends SafeComponent {
    send = v => {
        const message = v;
        if (!message || !message.length) {
            this.sendAck();
            return;
        }
        chatState.addMessage(message);
    };

    sendAck = () => chatState.addAck();

    plus = () => FileUploadActionSheet.show(true, false);

    uploadQueue() {
        const chat = chatState.currentChat;
        const q = (chat && chat.uploadQueue) || [];
        return q.map(f => <FileUploadProgress file={f} key={f.fileId} transparentOnFinishUpload />);
    }

    renderThrow() {
        const outer = {
            backgroundColor: vars.white
        };
        const s = {
            backgroundColor: vars.white,
            borderTopColor: vars.separatorColor,
            borderTopWidth: 1
        };
        return (
            <View style={outer}>
                <View>{this.uploadQueue()}</View>
                <View style={s}>
                    <InputMain
                        {...this.props}
                        plus={this.plus}
                        sendAck={this.sendAck}
                        send={this.send}
                    />
                </View>
            </View>
        );
    }
}
