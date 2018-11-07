import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { View } from 'react-native';
import { reaction, observable, when } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import ReadReceipt from './read-receipt';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import Text from '../controls/custom-text';
import { transitionAnimation } from '../helpers/animations';

const receiptRow = {
    backgroundColor: vars.black25,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    width: 40,
    marginHorizontal: 8,
    borderRadius: 16,
    paddingHorizontal: 2
};

const emptyReceiptRow = {
    alignSelf: 'flex-end',
    height: 20,
    width: 40,
    marginHorizontal: 8
};

const half = {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center'
};

const textStyle = {
    fontSize: vars.readReceiptFontSize,
    color: vars.darkBlue
};

@observer
export default class ViewReceipts extends SafeComponent {
    @observable receiptLabel = null;

    componentDidMount() {
        when(() => this.props.receipts && this.props.receipts.length, () => {
            this.prev = this.props.receipts.length;
            this.calculateLabel();
            transitionAnimation();

            this._observer = reaction(() => this.props.receipts && this.props.receipts.length, () => {
                if (!this.props.receipts || !this.props.receipts.length) return;
                if (this.props.keepAvatar) return;

                const firstView = this.props.receipts.length === 1;
                const viewsIncreased = this.props.receipts.length > this.prev;

                if (firstView || viewsIncreased) {
                    this.receiptLabel = this.receiptAvatar;
                    setTimeout(() => {
                        this.receiptLabel = this.receiptNumber;
                    }, 3000);
                }
            }, { fireImmediately: true });
        });
    }

    componentWillUnmount() {
        if (this._observer) this._observer();
    }

    get receiptAvatar() {
        const { receipts } = this.props;
        return <ReadReceipt username={_.last(receipts).username} avatarSize={vars.iconSizeSmall} />;
    }

    get receiptNumber() {
        const { receipts } = this.props;
        if (receipts.length < 10) {
            return <Text style={textStyle}>{receipts.length}</Text>;
        }
        return <Text style={textStyle}>9+</Text>;
    }

    calculateLabel = () => {
        const { receipts, keepAvatar } = this.props;
        if (!receipts) return;

        if (keepAvatar) {
            this.receiptLabel = this.receiptAvatar;
            return;
        }

        this.receiptLabel = this.receiptNumber;
    };

    renderThrow() {
        const { receipts } = this.props;
        if (!receipts || !receipts.length) return <View style={emptyReceiptRow} />;

        return (
            <View style={receiptRow}>
                <View style={half}>
                    {icons.plain('remove-red-eye', 12, vars.darkBlue)}
                </View>
                <View style={half}>
                    {this.receiptLabel}
                </View>
            </View>
        );
    }
}

ViewReceipts.propTypes = {
    receipts: PropTypes.any
};
