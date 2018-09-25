const timeoutWithAction = (component, initialAction, afterTimeoutAction, delay) => {
    initialAction();

    if (component.timeout) {
        clearTimeout(component.timeout);
        component.timeout = null;
    }

    component.timeout = setTimeout(afterTimeoutAction, delay);
};

module.exports = {
    timeoutWithAction
};
