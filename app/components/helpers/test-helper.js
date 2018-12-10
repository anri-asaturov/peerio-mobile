import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import uiState from '../layout/ui-state';
import testLabel from './test-label';

let currentScrollView = null;
let currentScrollPosition = 0;

function setScrollHelperRef(ref) {
    if (!__DEV__) return;
    currentScrollPosition = 0;
    currentScrollView = ref;
}

function setScrollHelperOnScroll(e) {
    if (!__DEV__) return;
    currentScrollPosition = e.nativeEvent.contentOffset.y;
}

export { setScrollHelperRef, setScrollHelperOnScroll };

const { height } = Dimensions.get('window');

/**
 * Test helper displays a yellow helper block
 * rendered only for DEV builds and used for
 * scrolling and hiding keyboard
 */
@observer
export default class TestHelper extends Component {
    scrollEnd = () => {
        if (currentScrollView.scrollToLocation) {
            const sectionList = currentScrollView.props.sections;
            const lastSection = sectionList.length - 1;
            const itemList = sectionList[lastSection].data;
            const lastItem = itemList.length - 1;
            currentScrollView.scrollToLocation({
                itemIndex: lastItem,
                sectionIndex: lastSection,
                animated: false
            }); // SectionList
        } else if (currentScrollView.scrollToEnd)
            currentScrollView.scrollToEnd({ animated: false }); // Scroll View + FlatList
    };

    scrollHome = () => {
        if (currentScrollView.scrollTo) currentScrollView.scrollTo({ y: 0, animated: false });
        // Scroll View
        else if (currentScrollView.scrollToOffset)
            currentScrollView.scrollToOffset({ offset: 0, animated: false });
        // FlatList
        else if (currentScrollView.scrollToLocation)
            currentScrollView.scrollToLocation({
                itemIndex: 0,
                sectionIndex: 0,
                viewPosition: 0,
                animated: false
            }); // SectionList
    };

    scrollUp = () => {
        const y = Math.max(0, currentScrollPosition - height / 2);
        if (currentScrollView.scrollTo) currentScrollView.scrollTo({ y, animated: false });
        // Scroll View
        else if (currentScrollView.scrollToOffset)
            currentScrollView.scrollToOffset({ offset: 0, animated: false });
        // FlatList
        else if (currentScrollView.scrollToLocation)
            currentScrollView.scrollToLocation({
                itemIndex: 0,
                sectionIndex: 0,
                viewOffset: 0,
                animated: false
            }); // SectionList
    };

    scrollDown = () => {
        if (currentScrollView.scrollTo)
            currentScrollView.scrollTo({ y: currentScrollPosition + height / 2, animated: false });
        // Scroll View
        else if (currentScrollView.scrollToOffset)
            currentScrollView.scrollToOffset({
                offset: currentScrollPosition + height / 2,
                animated: false
            });
        // FlatList
        else if (currentScrollView.scrollToLocation) {
            let itemIndex = 0;
            const sectionList = currentScrollView.props.sections;
            const sectionIndex = sectionList.length - 1;
            console.log(sectionList);
            console.log(sectionIndex);
            if (sectionIndex === 1) itemIndex = 5; // Only one section, likely scenario in chat list
            currentScrollView.scrollToLocation({ itemIndex, sectionIndex, animated: false }); // SectionList
        }
    };

    item(letter, id, action) {
        return (
            <TouchableOpacity {...testLabel(id)} onPress={action}>
                <Text style={{ color: 'black' }}>{letter}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        if (!__DEV__) return null;
        const s = {
            position: 'absolute',
            left: 0,
            top: 100,
            backgroundColor: 'yellow',
            alignItems: 'center'
        };
        return (
            <View key="testHelper" style={s}>
                {this.item('⍟', 'hideKeyboard', uiState.hideAll)}
                {this.item('↑', 'homeScroll', this.scrollHome)}
                {this.item('▲', 'upScroll', this.scrollUp)}
                {this.item('▼', 'downScroll', this.scrollDown)}
                {this.item('↓', 'endScroll', this.scrollEnd)}
                {this.item('1', 'testAction1', () => uiState.testAction1())}
                {this.item('2', 'testAction2', () => uiState.testAction2())}
                {this.item('3', 'testAction3', () => uiState.testAction3())}
            </View>
        );
    }
}
