const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    },
});

let boardState = [];

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.emit('load-board', boardState);

    socket.on('draw', (data) => {
        boardState.push(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear-board', () => {
        boardState = [];
        io.emit('clear-board');
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

console.log('Socket.IO server running on http://localhost:3000');
