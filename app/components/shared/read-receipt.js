import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, Image } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { contactStore } from '../../lib/icebear';

const circleDiameter = 18;

const circleStyle = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    margin: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
};

@observer
export default class ReadReceipt extends SafeComponent {
    constructor(props) {
        super(props);
        this.contact = contactStore.getContact(props.username);
    }

    renderThrow() {
        const { color, letter, mediumAvatarUrl } = this.contact;
        const circleOnline = {
            backgroundColor: color || '#ccc'
        };
        const letterView = (
            <View style={[circleStyle, circleOnline]}>
                <Text style={{ fontSize: 9, color: 'white' }}>{letter}</Text>
            </View>
        );
        const uri = mediumAvatarUrl;
        const avatarView = <Image style={circleStyle} source={{ uri, cache: 'force-cache' }} key={uri} />;
        return mediumAvatarUrl ? avatarView : letterView;
    }
}

ReadReceipt.propTypes = {
    username: PropTypes.string
};
