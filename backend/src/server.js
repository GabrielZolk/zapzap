const { WebSocketServer } = require('ws');
const dotenv = require('dotenv');

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on('connection', (websocket) => {
    websocket.on('error', console.error)

    websocket.on('message', (data) => {
        wss.clients.forEach((client) => {
            client.send(data.toString())
        })
    })
    console.log('Client Connected')
})