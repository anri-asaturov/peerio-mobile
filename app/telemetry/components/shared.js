/*
    These are the events for components that are shared between multiple views.
    Since they appear in more than one place, they need to know TmHelper.currentRoute for the `Sublocation` prop.
*/
import { telemetry } from '../../lib/icebear';
import { setup } from '../main';
import TmHelper from '../helpers';

const { S, errorMessage } = telemetry;

const shared = setup({
    textInputOnFocus: (label) => {
        return [
            S.TEXT_INPUT,
            {
                item: label,
                sublocation: TmHelper.currentRoute,
                state: S.IN_FOCUS
            }
        ];
    },

    // Used to send errors when input is blurred
    textInputOnBlur: (label, errorMsg) => {
        if (!errorMsg) return null; // Do not send error event if there is no error message
        if (errorMsg === 'error_usernameNotAvailable') return null; // Do not track this error here
        return [
            S.TEXT_INPUT,
            {
                item: label,
                sublocation: TmHelper.currentRoute,
                state: S.ERROR,
                errorType: errorMessage(errorMsg)
            }
        ];
    },

    textInputOnError: (label, errorMsg) => {
        if (errorMsg !== 'error_usernameNotAvailable' && errorMsg !== 'error_wrongAK') return null;
        return [
            S.TEXT_INPUT,
            {
                item: label,
                sublocation: TmHelper.currentRoute,
                state: S.ERROR,
                errorType: errorMessage(errorMsg)
            }
        ];
    },

    textInputOnClear: (label) => {
        return [
            S.CLEAR_TEXT,
            {
                item: label,
                sublocation: TmHelper.currentRoute
            }
        ];
    }
});

module.exports = shared;
