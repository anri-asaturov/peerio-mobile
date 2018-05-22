import PropTypes from 'prop-types';
import React from 'react';
import { View, ListView } from 'react-native';
import { observable, reaction, action } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { tx, tu } from '../utils/translator';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import Layout3 from '../layout/layout3';
import fileState from '../files/file-state';
import contactState from './contact-state';
import ContactEditPermissionItem from './contact-edit-permission-item';
import Text from '../controls/custom-text';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

@observer
export default class ContactEditPermission extends SafeComponent {
    @observable dataSource = [];

    // to speed up render performance
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;

    @observable.shallow sharedWithContacts = [];

    get data() { return this.sharedWithContacts; }

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.sharedWithContacts = contactState.store.contacts.slice();
    }

    @action.bound unshareFrom(/* contact */) {
        // HINT: removing on layout animated listview causes side effects
        // we just collapse it inline
        // this.sharedWithContacts.remove(contact);
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data,
            this.maxLoadedIndex
        ], () => {
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice(0, this.maxLoadedIndex));
            this.forceUpdate();
        }, true);
    }

    get unshareButton() {
        const extraWidth = 20;
        if (fileState.currentFile.isFolder && fileState.currentFile.isShared) {
            return icons.text(tu('button_unshare'), this.props.action, null, null, extraWidth);
        }
        return icons.disabledText(tu('button_unshare'), null, extraWidth);
    }

    exitRow() {
        const container = {
            flexDirection: 'row',
            paddingTop: vars.statusBarHeight + vars.spacing.small.midi2x,
            paddingHorizontal: vars.spacing.small.midi2x,
            alignItems: 'center',
            height: vars.headerHeight
        };
        const textStyle = {
            textAlign: 'center',
            flexGrow: 1,
            flexShrink: 1,
            fontSize: vars.font.size.big,
            color: vars.txtDark
        };
        return (
            <View style={container}>
                {icons.dark('close', this.props.onExit, { paddingRight: 20 })}
                <Text semibold style={textStyle}>{tx(this.props.title)}</Text>
                {this.unshareButton}
            </View>
        );
    }

    item = (contact) => {
        return (<ContactEditPermissionItem contact={contact} onUnshare={this.unshareFrom} />);
    };

    @action.bound onEndReached() {
        this.maxLoadedIndex += PAGE_SIZE;
    }

    body() {
        return (
            <ListView
                initialListSize={INITIAL_LIST_SIZE}
                pageSize={PAGE_SIZE}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={200}
                dataSource={this.dataSource}
                renderRow={this.item} />);
    }

    renderThrow() {
        const { footer } = this.props;
        const header = (
            <View style={{ flex: 0 }}>
                {this.exitRow()}
            </View>
        );
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout3
                defaultBar
                body={body}
                header={header}
                noFitHeight
                footer={footer}
                style={layoutStyle} />
        );
    }
}

ContactEditPermission.propTypes = {
    title: PropTypes.any,
    action: PropTypes.func,
    onExit: PropTypes.func,
    footer: PropTypes.any
};