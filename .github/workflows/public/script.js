const socket = io();

// DOM elements
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');
const sendButton = document.getElementById('send-btn');

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    const username = usernameInput.value.trim();
    
    if (message && username) {
        socket.emit('sendMessage', {
            text: message,
            user: username
        }, () => {
            // Clear input after sending
            messageInput.value = '';
        });
    }
}

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message on Enter key
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Display received messages
socket.on('message', (message) => {
    displayMessage(message);
});

// Display chat history
socket.on('history', (history) => {
    history.forEach(message => {
        displayMessage(message);
    });
});

// Display a message in the chat box
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `
        <span class="user">${message.user}</span>
        <span class="timestamp">${message.timestamp}</span>
        <p>${message.text}</p>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
