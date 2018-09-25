import { telemetry } from '../lib/icebear';
import TmHelper from './helpers';

function setup(obj) {
    const ret = {};
    Object.keys(obj).forEach(k => {
        ret[k] = makeSendFunction(obj[k]);
    });
    return ret;
}

function makeSendFunction(item) {
    // Each item in this object is either the event we want to send, or a function that returns the event
    // that we want to send based on an argument (e.g. if a property can change based on app state).
    if (typeof item === 'function') {
        return (...arg) => {
            if (item(...arg)) send(item(...arg));
        };
    }
    return () => {
        send(item);
    };
}

function send(event) {
    TmHelper.send(telemetry, event);
}

module.exports = {
    setup,
    makeSendFunction,
    send
};
