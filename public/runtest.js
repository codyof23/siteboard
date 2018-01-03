var socket;
var canv;

var hist = [];
var redo = [];

var bground;

var room_id;

var current_draw;


function connect(){
    socket = io.connect('69.30.210.118:3000');
//need to get connection info and assess p2p capabilities w/this function
//should add a wait time to make sure that connection goes through because
// next in setup is to establish room connection	    
};

function setup() {
	connect();

    canv = createCanvas(300, 300);
    canv.parent('canvas-holder');
	socket.on('init', newStroke);
	socket.on('moving', stroking);
    bground = '#013220';
}

function join1(){
	room_id = '1';
	socket.emit('room', room_id);
}

function join2(){
	room_id = '2';
	socket.emit('room', room_id);
}


function draw() {
    cursor(CROSS);
    background(bground);
    stroke('#f5f5f5');

    for (var i = 0; i < hist.length; i++) {
        hist[i].display();
    }
}

////////// Event-based functions /////////

function mousePressed() {

    var position = createVector(mouseX, mouseY);
    if(position.y >50) {
    	current_draw = (hist.length);
		console.log(current_draw);
        hist.push(new Stroke(position));
        console.log("new stroke!");
        var data = {
        func: "stroker",
        x: mouseX,
        y: mouseY,
        //can send the room_id in data, which can be accessed serverside
        //and used to route traffic accordingly
        id: room_id
    };
}
    //current_draw = (hist.length - 1);
    socket.emit('init', data);
}

function mouseDragged() {
    var position = createVector(mouseX, mouseY);
    if(position.y >50) {
    hist[current_draw].history.push(position);
    //console.log(hist[0].hist[0]);
    var data = {
        i: current_draw,
        x: mouseX,
        y: mouseY
    };
        
    socket.emit('moving', data);
}

}


/////// Functions from data received //////////


function newStroke(data) {
	var position = createVector(data.x, data.y);
	hist.push(new Stroke(position));
}
	
function stroking(data) {
    // this might get buggy if multiple clients are drawing at 
    // the same time. Might fix it by being more explicit
    // about strokes index
    var position = createVector(data.x, data.y);
    hist[data.i].history.push(position);    
}

///////// Draw functions ////////


function Stroke(vector) {
    this.history = [vector, vector];
    //this.hist.push(vector);
    
    this.display = function() {
        noFill();
        smooth();
        stroke('#f5f5f5');
        beginShape();
        for (var i = 0; i < this.history.length; i++) {
            var pos = this.history[i];
            vertex(pos.x, pos.y);
        }
        endShape();
    }   
}
	
