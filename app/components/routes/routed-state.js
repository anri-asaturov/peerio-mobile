import { observable } from 'mobx';
import { socket } from '../../lib/icebear';
import routes from './routes';

const globalRoutedState = observable({
    isInProgress: false
});

export default class RoutedState {
    _prefix = null;
    _routerMain = null;
    static _routerApp = null;
    get isInProgress() {
        return globalRoutedState.isInProgress;
    }
    set isInProgress(v) {
        globalRoutedState.isInProgress = v;
    }

    get routes() {
        return routes;
    }

    get isConnected() {
        return socket.connected;
    }

    get isAuthenticated() {
        return socket.authenticated;
    }

    get isActive() {
        if (!this._prefix) throw new Error('routed-state.js: no prefix');
        return !![routes.main, routes.app].filter(a => a.route.startsWith(this._prefix)).length;
    }

    get routerApp() {
        return this.routes.app;
    }

    get routerMain() {
        return this.routes.main;
    }

    get routerModal() {
        return this.routes.modal;
    }
}
