const process = require('process');
// Port where we'll run the websocket server
const webSocketsServerPort = process.env.TEST_LISTENER_PORT || 1337;
// websocket and http servers
const http = require('http');

class ListenerServer {
    constructor() {
        const server = http.createServer(() => {});

        const io = require('socket.io')(server);

        server.listen(webSocketsServerPort, function() {
            console.log(`${new Date()} Server is listening on port ${webSocketsServerPort}`);
        });

        // event fired every time a new client connects:
        io.on('connection', socket => {
            console.log(`Client connected [id=${socket.id}]`);

            socket.on('message', message => {
                console.log(`Incoming message`);
                console.log(message);
                this.processIncomingMessage(message);
            });
            // when socket disconnects, remove it from the list:
            socket.on('disconnect', () => {
                console.log(`Client gone [id=${socket.id}]`);
            });
        });
        Object.assign(this, { io, server });
        this.messageMap = {};
        this.index = 0;
    }

    request(data) {
        const message = this.formatMessage(data);
        this.messageMap[message.id] = message;
        const promise = new Promise((resolve, reject) => {
            Object.assign(message, { resolve, reject });
            this.io.emit('message', message);
        });
        return promise;
    }

    formatMessage(data) {
        const id = `${++this.index}`;
        const timestamp = new Date().getTime();
        const message = {
            id,
            timestamp,
            data
        };
        return message;
    }

    processIncomingMessage(message) {
        if (!message) {
            throw new Error('Message is a non-value');
        }
        const { id, data, error } = message;
        if (!id) {
            throw new Error('Message has no ID');
        }
        const cached = this.messageMap[id];
        if (!cached) {
            throw new Error(`Cannot find a message with ID ${id}`);
        }

        const { resolve, reject } = cached;
        if (error) {
            reject(error);
        } else {
            resolve(data);
        }

        delete this.messageMap[id];
    }

    close() {
        this.io.close();
        this.server.close();
    }
}

ListenerServer.create = () => {
    if (!ListenerServer.instance) {
        ListenerServer.instance = new ListenerServer();
    }
    return ListenerServer.instance;
};

module.exports = ListenerServer;
