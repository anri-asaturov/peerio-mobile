import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';
import { observer } from 'mobx-react/native';
import fileState from '../files/file-state';
import contactState from '../contacts/contact-state';
import icons from '../helpers/icons';

const actionCellStyle = {
    flex: 1,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center'
};

const actionTextStyle = {
    color: 'rgba(0,0,0,.38)'
};

const bottomRowStyle = {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, .12)',
    height: 56,
    padding: 0
};


@observer
export default class FileActions extends Component {

    action(text, icon, onPress, enabled) {
        return (
            <TouchableOpacity
                style={actionCellStyle}
                onPress={onPress && enabled ? onPress : null}
                pointerEvents={onPress ? null : 'none'}>
                <View pointerEvents="none" style={{ alignItems: 'center', opacity: enabled ? 1 : 0.5 }}>
                    {onPress ? icons.plaindark(icon) : icons.plain(icon, null, 'rgba(0, 0, 0, .38)')}
                    <Text style={actionTextStyle}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const animation = {
            overflow: 'hidden',
            height: this.props.height
        };
        const file = this.props.file;
        const enabled = file && file.readyForDownload;

        const leftAction = file && !file.isPartialDownload && file.cached ?
            this.action('Open', 'open-in-new', () => file.launchViewer(), enabled) :
            this.action('Download', 'file-download', () => fileState.download(), enabled);


        return (
            <Animated.View style={[bottomRowStyle, animation]}>
                {leftAction}
                {this.action('Share', 'reply', () => contactState.shareFile(), enabled)}
                {this.action('Delete', 'delete', () => fileState.delete(), enabled)}
                {/* {this.action('More', 'more-horiz')} */}
            </Animated.View>
        );
    }
}

FileActions.propTypes = {
    file: React.PropTypes.any,
    // {Animated.Value} height
    height: React.PropTypes.any
};
