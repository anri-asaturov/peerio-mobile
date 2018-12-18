import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import AlternatingText from '../controls/alternating-text';
import { fileStore, config } from '../../lib/icebear';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import Progress from '../shared/progress';

const messageArray = [
    {
        message: tx('title_migrationInProgressMessage1')
    },
    {
        message: tx('title_migrationInProgressMessage3')
    },
    {
        message: tx('title_migrationInProgressMessage4a'),
        messageB: tx('title_migrationInProgressMessage4b'),
        emoji: '\uD83D\uDCAA' // Muscle
    },
    {
        message: tx('title_migrationInProgressMessage5')
    },
    {
        message: tx('title_migrationInProgressMessage6')
    },
    // Skip message 7 because its for desktop
    {
        message: tx('title_migrationInProgressMessage8')
    },
    {
        message: tx('title_migrationInProgressMessage9')
    },
    {
        message: tx('title_migrationInProgressMessage10')
    },
    {
        message: tx('title_migrationInProgressMessage11')
    },
    {
        message: tx('title_migrationInProgressMessage12')
    }
];

if (config.enableVolumes) {
    messageArray.push({
        message: tx('title_migrationInProgressMessage2'),
        emoji: '\uD83D\uDE38' // Grinning cat
    });
}

const container = {
    justifyContent: 'center',
    marginTop: vars.spacing.huge.mini,
    marginBottom: vars.spacing.large.mini2x
};

const textStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    marginTop: vars.spacing.small.midi2x
};

@observer
export default class PopupMigration extends SafeComponent {
    get indicator() {
        return fileStore.migration.performedByAnotherClient ? (
            <ActivityIndicator size="large" style={{ margin: 40 }} />
        ) : (
            <View style={container}>
                <Progress max={100} value={fileStore.migration.progress} />
                {fileStore.migration.progress !== 0 && (
                    <Text style={textStyle}>
                        {tx('title_fileUpdateProgressPercent', {
                            progress: fileStore.migration.progress
                        })}
                    </Text>
                )}
            </View>
        );
    }

    renderThrow() {
        const alternatingTextStyle = {
            color: vars.black,
            fontSize: vars.font.size12,
            textAlign: 'center'
        };
        return (
            <View>
                {this.indicator}
                <AlternatingText
                    initialText={tx('title_fileUpdateProgressDescription')}
                    messageArray={messageArray}
                    textStyle={alternatingTextStyle}
                />
            </View>
        );
    }
}

PopupMigration.propTypes = {
    progress: PropTypes.any
};
