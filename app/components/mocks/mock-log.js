import { observable } from 'mobx';

class MockLog {
    @observable lines = [];
    get list() {
        return this.lines.join('\n');
    }

    beacon = null;
    lastTitle = '';

    start(title) {
        this.stopAndLog();
        this.log(`Starting ${title}`);
        this.lastTitle = title;
        this.beacon = new Date();
    }

    stopAndLog() {
        if (!this.beacon) return;
        const ms = new Date() - this.beacon;
        this.log(`${this.lastTitle} passed: ${ms} ms`);
        this.beacon = null;
        this.lastTitle = '';
    }

    log = line => {
        let data = `${line}`;
        const isString = typeof line === 'string' || line instanceof String;
        if (!isString) {
            try {
                data = JSON.stringify(line);
            } catch (e) {
                // no action
            }
        }
        this.lines.unshift(data);
    };

    inject() {
        console.debug = this.log;
        console.error = this.log;
    }
}

export default new MockLog();
