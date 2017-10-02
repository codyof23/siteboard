// express is a server program for running a local server
var express = require('express');

// this sets up our server on port 3000
var app = express();
var server = app.listen(3000);

//this just shows the contents of our 'public' directory
// that's where index.html and sketch.js are at
app.use(express.static('public'));


console.log("My socket server is running");

// imports the socket library and sets it up as a function
var socket = require('socket.io');

// calls the socket function with our server as its argument
// sets it up as a variable 'io' so that we can do things with it
var io = socket(server);

// checking for a new connection event
io.sockets.on('connection', newConnection);

// new connection function
function newConnection(socket){
    //logs the new connection's id
    console.log('new connection: ' + socket.id);

    // checks for a message coming from the particular
    // connection that we just made
    // "if we recieve a msg named 'mouse',
    // trigger the function 'mouseMsg' "
    socket.on('start', startMsg);
    socket.on('mouse', mouseMsg);
    socket.on('sound', soundMsg);
    socket.on('undo', undoMsg);
    socket.on('redo', redoMsg);
    socket.on('clear', clearMsg);
    socket.on('eraser', eraserMsg)

    function clearMsg() {
        socket.broadcast.emit('clear');
    }
    
    function undoMsg() {
        socket.broadcast.emit('undo');
    }

   function redoMsg() {
        socket.broadcast.emit('redo');
    }

    function soundMsg(data) {
        socket.broadcast.emit('sound', data);
    }
    
    function eraserMsg() {
        socket.broadcast.emit('eraser');
    }

    function startMsg(data) {
        
        //sends stroke start data to other clients
        socket.broadcast.emit('start', data);
        
        //sends data to all clients, original sender included
        //io.sockets.emit('mouse', data);
        
        //console.log(data);
    }
    
    //  logs the msg 'mouse'
    function mouseMsg(data) {
        
        //sends data to other clients
        socket.broadcast.emit('mouse', data);
        
        //sends data to all clients, original sender included
        //io.sockets.emit('mouse', data);
        
        //console.log(data);
    }

}





