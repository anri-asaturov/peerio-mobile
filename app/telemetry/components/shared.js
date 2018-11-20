import { telemetry } from '../../lib/icebear';
import { setup } from '../main';

const { S, errorMessage } = telemetry;

/*
    Properties recieved from the component are:
    - item (eg. S.USERNAME)
    - location (eg. S.SIGN_IN)
    - sublocation (eg. S.WELCOME_SCREEN)

    Other properties such as state and errorType as specific to each event
    and are therefore either defined here OR sent by the component when the event is triggered.
*/

const shared = setup({
    textInputOnFocus: tm => {
        return [
            S.TEXT_INPUT,
            {
                item: tm.item,
                location: tm.location,
                sublocation: tm.sublocation,
                state: S.IN_FOCUS
            }
        ];
    },

    // Used to send errors when input is blurred
    textInputOnBlur: (tm, errorMsg) => {
        if (!errorMsg) return null; // Do not send error event if there is no error message
        // Do not track these errors here
        if (errorMsg === 'error_usernameNotAvailable' || errorMsg === 'error_wrongAK') return null;
        return [
            S.TEXT_INPUT,
            {
                item: tm.item,
                location: tm.location,
                sublocation: tm.sublocation,
                state: S.ERROR,
                errorType: errorMessage(errorMsg)
            }
        ];
    },

    textInputOnError: (tm, errorMsg) => {
        if (errorMsg !== 'error_usernameNotAvailable' && errorMsg !== 'error_wrongAK') return null;
        return [
            S.TEXT_INPUT,
            {
                item: tm.item,
                location: tm.location,
                sublocation: tm.sublocation,
                state: S.ERROR,
                errorType: errorMessage(errorMsg)
            }
        ];
    },

    textInputOnClear: tm => {
        return [
            S.CLEAR_TEXT,
            {
                item: tm.item,
                location: tm.location,
                sublocation: tm.sublocation
            }
        ];
    },

    textInputOnMaxChars: tm => {
        return [
            S.TEXT_INPUT,
            {
                item: tm.item,
                location: tm.location,
                sublocation: tm.sublocation,
                state: S.MAX_CHARACTERS
            }
        ];
    }
});

module.exports = shared;
