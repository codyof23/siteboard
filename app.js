var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// imports the socket library and sets it up as a function
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);
// calls the socket function with our server as its argument
// sets it up as a variable 'io' so that we can do things with it
var io = socket(server);


// View Engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Set static path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/runtest', function(req, res){
	res.render('runtest');
});




console.log("My socket server is running");





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


	// new functions being tested in test board
	var id;
    
	socket.on('room', joinRoom);

	function joinRoom(room_id){
		socket.join(room_id);	
		console.log('room id is ' + room_id);
		id = room_id;
	}
    // checks for a message coming from the particular
    // connection that we just made
    // "if we recieve a msg named 'mouse',
    // trigger the function 'mouseMsg' "
    socket.on('init', initMsg);
    socket.on('moving', movingMsg);
        
    function initMsg(data) {
        //sends stroke start data to other clients
        socket.broadcast.to(id).emit('init', data);
        
        //sends data to all clients, original sender included
        //io.sockets.emit('mouse', data);
    }
    
    function movingMsg(data) {
    	socket.broadcast.to(id).emit('moving', data);
    }
    
    
    
    
    //end of new functions

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
