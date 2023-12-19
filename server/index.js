const {WebSocket, WebSocketServer} = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({server});
const port = 8080;
server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});

// active connections
const clients = {};

// A new client connection request received
wsServer.on('connection', function (connection) {
    // Generate a unique code for every user
    const userId = uuidv4();
    console.log('Received a new connection');

    // Send existing users
    if (connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify(existingUsersMessage()));
    }

    // Store the new connection and handle messages
    clients[userId] = {connection: connection};
    console.log(`${userId} connected.`);
    // User disconnected
    connection.on('close', () => handleDisconnect(userId));

    connection.on('message', function (message) {
        const name = JSON.parse(message);
        console.log(`Received from ${userId} data ${name}`);
        clients[userId].name = name;

        // Send the new user to the other clients
        Object.keys(clients)
            .filter(existingUserId => existingUserId !== userId)
            .filter(existingUserId => clients[existingUserId].connection.readyState === WebSocket.OPEN)
            .forEach(existingUserId => clients[existingUserId].connection.send(JSON.stringify(newUserMessage(userId, name))));
    })
});

function handleDisconnect(userId) {
    console.log(`${userId} disconnected.`);
    delete clients[userId];

    Object.keys(clients)
        .filter(existingUserId => clients[existingUserId].connection.readyState === WebSocket.OPEN)
        .forEach(existingUserId => clients[existingUserId].connection.send(JSON.stringify(userDisconnectedMessage(userId))));
}

const existingUsersMessage = () => ({
    type: "EXISTING_USERS",
    users: Object.keys(clients).map(userId => ({
        id: userId,
        name: clients[userId].name
    }))
});

const newUserMessage = (id, name) => ({
    type: "NEW_USER",
    user: {
        id: id,
        name: name
    }
});

const userDisconnectedMessage = (id) => ({
    type: "USER_DISCONNECTED",
    user: {
        id: id
    }
})
