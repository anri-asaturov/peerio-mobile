function selectorWithText(query) {
    return `android=new UiSelector().text("${query}")`;
}

function selectorWithPartialResourceId(query) {
    return `android=new UiSelector().resourceIdMatches("${query}")`;
}

function selectorWithPartialText(query) {
    return `android=new UiSelector().textContains("${query}")`;
}

module.exports = {
    selectorWithText,
    selectorWithPartialResourceId,
    selectorWithPartialText
};
