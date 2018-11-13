import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { action } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import FileProgress from './file-progress';
import { fileState } from '../states';
import FileTypeIcon from './file-type-icon';
import { fileHelpers } from '../../lib/icebear';
import FileActionSheet from './file-action-sheet';
import ButtonText from '../controls/button-text';
import MenuIcon from '../layout/menu-icon';
import { tx } from '../utils/translator';
import snackbarState from '../snackbars/snackbar-state';

const textStyle = {
    textAlign: 'center',
    fontSize: vars.font.size16,
    color: vars.extraSubtleText,
    marginBottom: vars.spacing.medium.mini2x
};

const fileProgressContainer = {
    justifyContent: 'center',
    height: vars.progressBarHeight,
    paddingHorizontal: vars.spacing.huge.midi2x,
    marginTop: vars.spacing.medium.midi2x,
    marginBottom: vars.spacing.small.midi2x
};

const centered = {
    alignItems: 'center'
};

@observer
export default class FileDetailView extends SafeComponent {
    get file() { return fileState.currentFile || {}; }

    get rightIcon() { return (<MenuIcon action={() => FileActionSheet.show(this.file, false, 'files')} />); }

    get enabled() {
        return this.file && this.file.readyForDownload || fileState.showSelection;
    }

    @action.bound onCancel() {
        fileState.cancelDownload(this.file);
    }

    @action.bound onOpen() {
        const { file } = this;
        file.launchViewer().catch(() => {
            snackbarState.pushTemporary(tx('snackbar_couldntOpenFile'));
        });
    }

    @action.bound onDownload() {
        fileState.download(this.file);
    }

    get button() {
        const { file, enabled } = this;
        if (file.downloading) {
            return (<ButtonText
                text={tx('button_cancel')}
                onPress={this.onCancel}
                disabled={!enabled}
                testID="cancel"
            />);
        } else if (file.hasFileAvailableForPreview) {
            return (<ButtonText
                text={tx('button_open')}
                onPress={this.onOpen}
                disabled={!enabled}
                testID="open"
            />);
        }
        return (<ButtonText
            text={tx('button_download')}
            onPress={this.onDownload}
            disabled={!enabled}
            testID="download"
        />);
    }

    renderThrow() {
        const { file } = this;

        return (
            <View style={{ flexGrow: 1, justifyContent: 'center', backgroundColor: vars.darkBlueBackground05 }}>
                <View style={centered}>
                    {<FileTypeIcon size="medium" type={fileHelpers.getFileIconType(file.ext)} /> }
                </View>
                <View style={fileProgressContainer}>
                    {file.downloading && <FileProgress file={file} />}
                </View>
                <View style={centered}>
                    <Text style={textStyle}>
                        {tx(file.downloading ? 'title_downloadingFile' : 'title_noPreview')}
                    </Text>
                    {this.button}
                </View>
            </View>
        );
    }
}
