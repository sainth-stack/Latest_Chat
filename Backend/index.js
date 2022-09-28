var app = require('express')();
var http = require('http').Server(app);
// var io = require('socket.io')(http);
var bodyParser = require('body-parser')
var cors = require('cors');
app.use(cors())
require('dotenv').config();
const connectDB = require('./db');
const path = require('path');
const fs = require('fs');
connectDB()
const io = require('socket.io')(http, { cors: { origin: "*" } });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')
io.on('connection', function (socket) {
  socket.on('join', ({ name, room, msg, type, userType, send }, callback) => {
    const id = socket.id
    const { user } = addUser({ name, room, msg, id, type, userType })
    socket.join(user.room);
    const users = getUser(room, name);
    socket.broadcast.emit('usersall', { user, users: users })
    if (user.name !== 'admin' && send) {
      socket.emit('message', { user: `${user.name}`, seen: false, message: `Name:${user.name + "\n"}Email:${user.room + "\n"}Type:${user.type + '\n'}Message:${user.msg}`, msgid: `${user.room}`, type: 'other' }); setTimeout(function () {
        socket.emit('message', { user: 'admin', message: `Thank you for contacting us. Our agent will respond in a min.`, msgid: null });
      }, 2000);
    }
    socket.broadcast.to(user.room).emit('joinl', { user: 'admin', seen: true, email: user.room, users: users });
    callback()
  })
  socket.on('sendMessage', (message, name, room, d, seen, type, callback) => {
    const user = getUser(room, name);
    io.to(user.room).emit('message', { user: user.name, message: message, msgid: user.room, date: d, seen: seen, type: type });
    callback();
  });
  socket.on("upload", (file, name, room, d, seen, type, img, imgtype,callback) => {
    io.to(room).emit('file', { user: name, message: file, msgid: room, date: d, seen: seen, type: type,img ,imgtype:imgtype});
    callback();
  });
  socket.on('leave', (room, callback) => {
    io.to(room).emit('end', { user: 'admin', message: `has left.`, email: `${room}` })
  })
  socket.on('disconnect', () => {
    console.log('user diconnect')
    const user = removeUser(socket.id)
    if (user) {
      socket.broadcast.emit('end', { user: 'admin', text: `${user.name} has left.`, email: `${user.room}` })
      // io.to(user.room).emit('end', { user: 'admin', message: `${user.name} has left.`, email: `${user.room}` })
    }
  })
});
const entityRoutes = require('./router')
app.use('/api', entityRoutes);
const port = process.env.PORT || 6000
http.listen(port, function () {
  console.log('listening on localhost:5000');
});

