import React from 'react';
import { observer } from 'mobx-react/native';
import { FlatList } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import TosAccordionItem from './tos-accordion-item';

const iconPadding = vars.spacing.small.midi2x;

const listData = [
    {
        title: 'title_termsDataCollection',
        leftIcon: {
            on: icons.coloredNoPadding('help-outline', null, { padding: iconPadding }, vars.peerioBlue),
            off: icons.darkNoPadding('help-outline', null, { padding: iconPadding })
        },
        content: [
            {
                subtitle: 'title_metadata',
                description: 'title_termsMetadataParagraph'
            },
            {
                subtitle: 'title_accountInformation',
                description: 'title_termsAccountInfoParagraph'
            },
            {
                subtitle: 'title_ipAddress',
                description: 'title_termsIpParagraph'
            }
        ]
    },
    {
        title: 'title_termsDataThirdParty',
        leftIcon: {
            on: icons.coloredNoPadding('settings', null, { padding: iconPadding }, vars.peerioBlue),
            off: icons.darkNoPadding('settings', null, { padding: iconPadding })
        },
        content: [
            {
                subtitle: 'title_service',
                description: 'title_termsServiceParagraph'
            },
            {
                subtitle: 'title_communications',
                description: 'title_termsCommunicationsParagraph'
            },
            {
                subtitle: 'title_analytics',
                description: 'title_termsAnalyticsParagraph'
            }
        ]
    },
    {
        title: 'title_termsOfUse',
        leftIcon: {
            on: icons.imageIconNoPadding(require('../../assets/icons/tos-read-icon-on.png'), null, { padding: iconPadding }),
            off: icons.imageIconNoPadding(require('../../assets/icons/tos-read-icon-off.png'), null, { padding: iconPadding })
        },
        content: [
            {
                subtitle: 'title_content',
                description: 'title_termsContentParagraph'
            },
            {
                subtitle: 'title_behaviour',
                description: 'title_termsBehaviourParagraph'
            },
            {
                subtitle: 'title_security',
                description: 'title_termsSecurityParagraph'
            }
        ]
    }
];

@observer
export default class TosAccordion extends SafeComponent {
    keyExtractor = item => item.title;

    listItem({ item, index }) {
        return (<TosAccordionItem index={index} data={item} />);
    }

    renderThrow() {
        return (
            <FlatList
                keyExtractor={this.keyExtractor}
                data={listData}
                renderItem={this.listItem}
                style={[{ marginBottom: vars.spacing.medium.midi2x }, this.props.style]} />);
    }
}
