const express       = require('express');
const SocketServer  = require('ws').Server;
const path          = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

//We need an HTTP server to do two things: serve our client-side assets and provide a hook for the WebSocket server to monitor for upgrade requests
const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.info(`Listening on ${PORT}`));

// The WebSocket server takes an HTTP server as an argument so that it can listen for ‘upgrade’ events
const wss = new SocketServer({ server });

// Listen for and log connections and disconnections
wss.on('connection', (ws) => {
  console.info('Client connected');
  ws.on('close', () => console.info('Client disconnected'));
});

// Broadcast data to all clients without waiting for client requests
setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);