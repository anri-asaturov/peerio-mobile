/* eslint-disable no-eval */

// eslint-disable-next-line
function testPromiseResolve() {
    return new Promise(resolve => {
        setTimeout(() => resolve(1000), 3000);
    });
}

// eslint-disable-next-line
function testPromiseReject() {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('reject')), 3000);
    });
}

const host = process.env.TEST_LISTENER_HOST || 'localhost';
const port = process.env.TEST_LISTENER_PORT || 1337;

class TestBridgeWebSocket {
    constructor(websocketClientClass) {
        this.socket = new websocketClientClass(`ws://${host}:${port}`);

        this.socket.on('connect', () => {
            console.debug('🤖 test socket connected.');
        });

        this.socket.on('disconnect', reason => {
            console.debug(`🤖 test socket disconnected. ${reason}`);
        });

        // we don't want to spam in our application log with this
        /* this.socket.on('connect_error', err => {
            console.error('🤖 connect error', err);
        }); */

        this.socket.on('connect_timeout', timeout => {
            console.error('🤖 connect timeout', timeout);
        });

        this.socket.on('error', err => {
            console.error('🤖 socket error', err);
        });

        this.socket.on('message', async message => {
            console.debug(`🤖 ${new Date()}: incoming message`);
            console.debug(message);
            let id = null;
            let error = null;
            let result = null;
            try {
                if (!message) {
                    throw new Error('Message is empty');
                }
                id = message.id;
                if (!id) {
                    throw new Error('Message id is empty');
                }
                const { data } = message;
                if (!data) {
                    throw new Error('Message data is empty');
                }
                result = eval(data);
                if (result && result.then) {
                    console.debug('Result is a promise, awaiting result');
                    result = await result;
                }
                console.debug(result);
            } catch (e) {
                console.error(e);
                error = e.message;
            }
            const timestamp = new Date().getTime();
            this.socket.emit('message', {
                id,
                timestamp,
                data: result,
                error
            });
        });

        console.debug('🤖 test socket: waiting for connection.');
        this.socket.open();
    }
}

module.exports = TestBridgeWebSocket;
