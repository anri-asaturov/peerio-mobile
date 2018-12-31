const process = require('process');
const readline = require('readline');

const ListenerServer = require('./listener-server');

const server = ListenerServer.create();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt() {
    rl.question('test-cli > ', line => {
        if (line === 'quit') {
            server.close();
            rl.close();
            return;
        }
        if (line.trim()) {
            server.request(line);
        }
        prompt();
    });
}

prompt();
