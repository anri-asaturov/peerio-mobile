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
            const { id } = socket;
            console.log(`Client connected [id=${id}]`);
            this.clientMap[socket.id] = socket;

            socket.on('message', message => {
                console.log(`Incoming message from ${socket.id}`);
                console.log(message);
                this.processIncomingMessage(message);
            });
            // when socket disconnects, remove it from the list:
            socket.on('disconnect', () => {
                console.log(`Client gone [id=${id}]`);
                delete this.clientMap[socket.id];
            });
        });
        Object.assign(this, { io, server });
        this.messageMap = {};
        this.clientMap = {};
        this.index = 0;
    }

    checkClients() {
        const clientCount = Object.keys(this.clientMap).length;
        if (clientCount !== 1) {
            console.error(`Error: ${clientCount} clients connected to the listener`);
            return false;
        }
        return true;
    }

    async request(data) {
        if (!this.checkClients()) {
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        this.checkClients();
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
        this.checkClients();
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
}

ListenerServer.create = () => {
    if (!ListenerServer.instance) {
        ListenerServer.instance = new ListenerServer();
    }
    return ListenerServer.instance;
};

ListenerServer.close = () => {
    ListenerServer.instance.io.close();
    ListenerServer.instance.server.close();
    ListenerServer.instance = null;
};

module.exports = ListenerServer;
