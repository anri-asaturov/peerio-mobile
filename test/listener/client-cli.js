const io = require('socket.io-client');
const TestBridgeWebSocket = require('./test-bridge-web-socket');

// eslint-disable-next-line
const testBridgeWebSocket = new TestBridgeWebSocket(io.connect);
