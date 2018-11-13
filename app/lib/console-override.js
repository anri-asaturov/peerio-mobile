import { observable, reaction } from 'mobx';
import { TinyDb } from '../lib/icebear';
/**
 * This class wires regular console.log/debug/info functions
 * into a proxy which saves the logs into an array
 * This is mostly used to display logs to the user (via UI)
 */

const VERBOSE_LOGS_KEY = 'verboseLogs';

class ConsoleOverride {
    @observable verbose = false;

    async areVerboseLogsEnabled() {
        return process.env.VERBOSE_LOGS || TinyDb.system.getValue(VERBOSE_LOGS_KEY);
    }

    async configureConsole() {
        this.verbose = await this.areVerboseLogsEnabled();
        reaction(() => this.verbose, value => (value ? TinyDb.system.setValue(VERBOSE_LOGS_KEY, value) :
            TinyDb.system.removeValue(VERBOSE_LOGS_KEY)));
        const { verbose } = this;

        if (console._errorOriginal) {
            console.error = console._errorOriginal;
        }

        global.ErrorUtils && global.ErrorUtils.setGlobalHandler((error, isFatal) => {
            console.error(`App.js: unhandled error, fatal: ${isFatal}`);
            if (error) {
                const { message, stack, column, line } = error;
                if (column || line) console.error(`Error on column ${column}, line ${line}`);
                if (message) console.error(`Message: ${message}`);
                if (stack) console.error(`Stack: ${stack}`);
            }
        });

        console.stack = [];
        console.stackPush = (msg, color) => {
            const MAX = 300;
            const STEP = 50;
            const index = console.stack.length;
            const delta = index - MAX;
            const time = new Date();
            console.stack.unshift({ msg, time, color });
            if (delta > STEP) console.stack.splice(-delta, delta);
        };

        console.stackPushLog = msg => console.stackPush(msg, 'black');
        console.stackPushError = msg => console.stackPush(msg, 'red');
        console.stackPushWarning = msg => console.stackPush(msg, 'darkorange');
        console.stackPushDebug = msg => console.stackPush(msg, 'darkblue');

        const { log } = console;
        console.log = function () {
            __DEV__ && log.apply(console, arguments);
            Array.from(arguments).reverse().forEach(console.stackPushLog);
        };

        const { warn } = console;
        console.warn = function () {
            __DEV__ && warn.apply(console, arguments);
            Array.from(arguments).reverse().forEach(console.stackPushWarning);
        };

        console.disableYellowBox = true;

        const { error } = console;
        console.error = function () {
            __DEV__ && error.apply(console, arguments);
            Array.from(arguments).reverse().forEach(console.stackPushError);
        };

        const { debug } = console;
        console.debug = function () {
            __DEV__ && verbose && debug.apply(console, arguments);
            verbose && Array.from(arguments).reverse().forEach(console.stackPushDebug);
        };

        console.debug('console-override.js: debug logs are enabled');
    }
}

export default new ConsoleOverride();
