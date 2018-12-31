import React from 'react';
import { observer } from 'mobx-react/native';
import ChatZeroStatePlaceholder from '../../messaging/chat-zero-state-placeholder';
import Text from '../../controls/custom-text';
import { tx } from '../../utils/translator';
import { vars } from '../../../styles/styles';
import routes from '../../routes/routes';
import BlueRoundButton from '../../buttons/blue-round-button';

const chatHeaderStyle = {
    color: vars.darkBlue,
    fontSize: vars.font.size24,
    textAlign: 'center',
    marginTop: vars.spacing.medium.maxi2x,
    marginBottom: vars.spacing.medium.mini2x
};

@observer
export default class MedcryptorChatZeroStatePlaceholder extends ChatZeroStatePlaceholder {
    get headerText() {
        return (
            <Text italic style={chatHeaderStyle}>
                {tx('title_headerZeroState')}
            </Text>
        );
    }

    get findContactsButton() {
        return (
            <BlueRoundButton
                text="title_findContactsZeroState"
                onPress={routes.main.contactAdd}
                style={{ backgroundColor: vars.peerioPurple }}
            />
        );
    }
}
