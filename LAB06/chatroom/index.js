const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const hbs = require('hbs');

const {generateMessage} = require("./js/messange")
const {addUser, removeUser, getUser, getUsersInRoom, getUserByUsername} = require('./js/users')
const {isRoomPrivate, setRoomPrivate} = require('./js/rooms')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/web'));

io.on('connection', (socket) => {
    socket.on('join', (options, callback) => {

        const {error, user} = addUser({id: socket.id, ...options})

        if(isRoomPrivate(user.room)) {
            removeUser(socket.id)
            return;
        }

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', `Welcome, ${user.username}!`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            users: getUsersInRoom(user.room)
        })


        callback()
    })

    socket.on('sendMessage', ({ message, to }, callback) => {
        const user = getUser(socket.id);

        if (to) {
            const recipient = getUserByUsername(to);
            if (recipient && recipient.room === user.room) {
                io.to(recipient.id).emit('message', generateMessage(user.username, message, true));
                callback();
                return;
            } else {
                callback('Recipient not found or not in the same room.');
                return;
            }
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });



    socket.on('setPrivate', (message, callback) => {
        const user = getUser(socket.id)
        setRoomPrivate(!message.is_checked, user.room)
        io.to(user.room).emit('message', generateMessage('Admin', `Changed room settings`))
        callback()
    })

    socket.on('userTyping', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('userTyping', generateMessage(`${user.username}`, `${user.username} is typing...`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                users: getUsersInRoom(user.room),
                isPrivate: isRoomPrivate(user.room)
            })
        }
    })
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/index.html');
});
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/web/chat.html');
});


server.listen(3000, function () {
    console.log('listening on http://localhost:3000');
});