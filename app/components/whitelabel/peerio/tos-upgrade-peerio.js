import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../../shared/safe-component';
import Text from '../../controls/custom-text';
import { vars } from '../../../styles/styles';
import { tx } from '../../utils/translator';

@observer
export default class TermsOfUseUpgradePeerio extends SafeComponent {
    renderThrow() {
        return (
            <Text
                semibold
                style={{
                    color: vars.black54,
                    fontSize: vars.font.size12,
                    paddingBottom: 60
                }}>
                {tx(this.props.paymentInfo)}
            </Text>
        );
    }
}
