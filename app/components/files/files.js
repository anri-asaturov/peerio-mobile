import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, Animated, Text, TextInput, Platform } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FilesPlaceholder from './files-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import FileItem from './file-item';
import FolderActionSheet from './folder-action-sheet';
import FilesActionSheet from './files-action-sheet';
import fileState from './file-state';
import PlusBorderIcon from '../layout/plus-border-icon';
import { upgradeForFiles } from '../payments/payments';
import BackIcon from '../layout/back-icon';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import icons from '../helpers/icons';

const iconClear = require('../../assets/file_icons/ic_close.png');

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

let filesActionSheet = null;

function backFolderAction() {
    fileState.currentFolder = fileState.currentFolder.parent;
}

@observer
export default class Files extends SafeComponent {
    @observable findFilesText;

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    get leftIcon() {
        if (fileState.currentFolder.isRoot) return null;
        return <BackIcon action={backFolderAction} />;
    }

    get rightIcon() {
        return <PlusBorderIcon action={() => filesActionSheet.show()} />;
    }

    get layoutTitle() {
        if (fileState.currentFolder.isRoot) return null;
        return fileState.currentFolder.name;
    }

    @observable dataSource = null;
    @observable refreshing = false
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;
    actionsHeight = new Animated.Value(0)

    get data() {
        return fileState.store.currentFilter ?
            fileState.store.visibleFilesAndFolders
            : fileState.currentFolder.foldersAndFilesDefaultSorting;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        reaction(() => fileState.showSelection, v => {
            const duration = 200;
            const toValue = v ? 56 : 0;
            Animated.timing(this.actionsHeight, { toValue, duration }).start();
        });

        this.reaction = reaction(() => [
            fileState.routerMain.route === 'files',
            fileState.routerMain.currentIndex === 0,
            this.currentFolder,
            this.data,
            this.data.length,
            this.maxLoadedIndex,
            fileState.store.currentFilter
        ], () => {
            // console.log(`files.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice(0, this.maxLoadedIndex));
            this.forceUpdate();
        }, true);
    }

    onChangeFolder = folder => { fileState.currentFolder = folder; }

    item = file => {
        return (
            <FileItem
                key={file.fileId || file.folderId}
                file={file}
                onChangeFolder={this.onChangeFolder}
                onLongPress={() => this._folderActionSheet.show(file)} />
        );
    }

    onEndReached = () => {
        // console.log('files.js: on end reached');
        this.maxLoadedIndex += PAGE_SIZE;
    }

    listView() {
        return (
            <ListView
                initialListSize={INITIAL_LIST_SIZE}
                pageSize={PAGE_SIZE}
                dataSource={this.dataSource}
                renderRow={this.item}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={20}
                enableEmptySections
                ref={sv => { this.scrollView = sv; }}
            />
        );
    }

    get noFilesInFolder() {
        if (this.data.length || fileState.currentFolder.isRoot) return null;
        const s = {
            color: vars.txtMedium,
            textAlign: 'center',
            marginTop: vars.headerSpacing
        };
        return <Text style={s}>{tx('title_noFilesInFolder')}</Text>;
    }

    onChangeFindFilesText(text) {
        const items = text.split(/[ ,;]/);
        if (items.length > 1) {
            this.findFilesText = items[0].trim();
            this.onSubmit();
            return;
        }
        this.findFilesText = text;
        this.searchFileTimeout(text);
    }

    searchFileTimeout(filename) {
        if (this._searchTimeout) {
            clearTimeout(this._searchTimeout);
            this._searchTimeout = null;
        }
        if (!filename) {
            fileState.store.clearFilter();
            return;
        }
        this._searchTimeout = setTimeout(() => this.searchFile(filename), 500);
    }

    searchFile = val => {
        if (val === '' || val === null) {
            fileState.store.clearFilter();
            return;
        }
        fileState.store.filterByName(val);
    };

    searchTextbox() {
        const height = vars.searchInputHeight;
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: vars.spacing.small.midi2x,
            marginHorizontal: vars.spacing.medium.mini2x,
            marginVertical: vars.spacing.small.midi2x,
            borderColor: vars.verySubtleGrey,
            borderWidth: 1,
            height,
            borderRadius: height
        };
        const fontSize = vars.font.size.bigger;
        const marginTop =
            Platform.OS === 'android' ? (height - fontSize + 2) / 2 : 0;
        const placeholderStyle = {
            flexGrow: 1,
            height,
            lineHeight: height * 1.5,
            paddingTop: 0,
            marginTop,
            marginLeft: vars.spacing.small.midi,
            fontSize
        };

        const leftIcon = icons.plain('search', vars.iconSize, vars.txtDate);

        let rightIcon = null;
        if (this.findFilesText) {
            rightIcon = icons.iconImage(iconClear, () => {
                this.findFilesText = '';
                this.onChangeFindFilesText('');
            });
        }

        return (
            <View>
                <View style={container}>
                    {leftIcon}
                    <TextInput
                        underlineColorAndroid="transparent"
                        value={this.findFilesText}
                        returnKeyType="done"
                        onSubmitEditing={this.onSubmit}
                        onChangeText={text => { this.clean = !text.length; this.onChangeFindFilesText(text); }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder={tx('title_search')}
                        ref={ti => { this.textInput = ti; }}
                        style={placeholderStyle} />
                    {rightIcon}
                </View>
            </View>
        );
    }

    body() {
        if (this.data.length || !fileState.currentFolder.isRoot) return this.listView();
        if (!this.data.length && this.findFilesText && !fileState.store.loading) {
            return (
                <Text style={{ marginTop: vars.headerSpacing, textAlign: 'center' }}>
                    {tx('title_noFilesMatchSearch')}
                </Text>
            );
        }
        return !fileState.store.loading && <FilesPlaceholder />;
    }

    renderThrow() {
        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {this.searchTextbox()}
                    {upgradeForFiles()}
                    {!this.data.length && !fileState.currentFolder.isRoot ?
                        this.noFilesInFolder : null}
                    {this.body()}
                </View>
                <ProgressOverlay enabled={fileState.store.loading} />
                <FolderActionSheet ref={ref => { this._folderActionSheet = ref; }} />
                <FilesActionSheet createFolder ref={ref => { filesActionSheet = ref; }} />
            </View>
        );
    }
}
