const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Store chat history
const chatHistory = [];

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // Send chat history to new user
    socket.emit('history', chatHistory);

    // Listen for new messages
    socket.on('sendMessage', (message, callback) => {
        const msg = {
            id: Date.now(),
            text: message.text,
            user: message.user,
            timestamp: new Date().toLocaleTimeString()
        };

        // Add to history (limit to 100 messages)
        chatHistory.push(msg);
        if (chatHistory.length > 100) chatHistory.shift();

        // Broadcast to all clients
        io.emit('message', msg);
        
        // Acknowledge
        callback();
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
