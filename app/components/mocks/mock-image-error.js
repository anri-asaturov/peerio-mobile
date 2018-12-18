import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { observer } from 'mobx-react/native';

// const goodImage = 'https://www.homedepot.com/hdus/en_US/DTCCOMNEW/fetch/Category_Pages/Doors_and_Windows/windows-A.jpg';
const badImage = 'http://10.255.255.1/test.png';
const uri = badImage;

@observer
export default class MockImageError extends Component {
    componentDidMount() {
        // popupControl(<PaymentsInfoPopup text={plans[1].paymentInfo} />);
    }

    render() {
        const source = { uri };
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                <Image
                    onLoadEnd={() => console.error('load end')}
                    onError={e => console.error(e)}
                    style={{ width: 100, height: 100 }}
                    source={source}
                />
            </View>
        );
    }
}
