const express = require('express');
const app = express();
const server = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('send message', (msg) => {
        io.emit('chat message', {msg : msg , username : socket.username});
    });

    socket.on('new user', (username, callback) =>{
        
        if(users.indexOf(username) != -1){
            return;
        }else{
            socket.username = username;
            users.push(socket.username);
            updateUsers();
        }
    });

    function updateUsers(){
        io.sockets.emit('updateUsers', users);
    };

    socket.on('disconnect', () =>{
        if(!socket.username){
            return;
        }
        users.splice(users.indexOf(socket.username) , 1);
        updateUsers();
    })

});

server.listen(3000 , () => {
    console.log('Server is running on 3000');
})