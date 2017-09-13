var socket;
//var dropzone;

var canv;

var hist = [];
var redo = [];

var mic;

var bground;

var drawfunctions= {
    stroker: true,
    liner: false,
    circle: false,
    imager: false
};



function setup() {
    canv = createCanvas(window.innerWidth, window.innerHeight);
    canv.parent('canvas-holder');

    bground = '#013220';

    socket = io.connect('199.233.246.208:3000');
    socket.on('start', newStroke);
    socket.on('mouse', stroking);
    //socket.on('sound', newSound);
    socket.on('undo', undoer);
    socket.on('redo', redoer);
    socket.on('clear', onclear);
    
    //dropzone = select('#dropzone');
    //canv.dragOver(highlight);
    //canv.dragLeave(unhighlight);
    canv.drop(gotFile);

    //mic = new p5.AudioIn();
    //mic.start();
    //console.log(typeof(mic));
}

document.ontouchmove = function(e){ e.preventDefault(); }

function noscroll() {
  window.scrollTo( 0, 0 );
}

// add listener to disable scroll
window.addEventListener('scroll', noscroll);


function gotFile(file){

    //drawImage(bground, 50, 50)
    //background(bground);
    //console.log(bground);
    //img.hide();
    //hist.push(new Imager(img, mouseX, mouseY));
}


//function highlight() {
//    dropzone.style('background-color', '#ccc');
//}

//function unhighlight() {
//    dropzone.style('background-color', '#2f2f2f');
//}

//function newSound(mic) {
 //   sound = loadSound(mic);
//    sound.play();
//}

function onclear() {
    hist = [];
    redo = [];
}

function newStroke(data) {
    var position = createVector(data.x, data.y);
    if (data.func == "stroker") {
        hist.push(new Stroke(position));
    }
    
    if (data.func == "liner") {
        hist.push(new Line(position));
    }
    
    if (data.func == "circle") {
        hist.push(new Circle(position));
    }
}

function stroking(data) {
    // this might get buggy if multiple clients are drawing at 
    // the same time. Might fix it by being more explicit
    // about strokes index
    var position = createVector(data.x, data.y);
    hist[(hist.length - 1)].hist.push(position);    
}

function draw() {
    cursor(CROSS);
    background(bground);


    stroke('#f5f5f5');

    for (var i = 0; i < hist.length; i++) {
        hist[i].display();
    }
   // var vol = mic.getLevel();
    //console.log(vol);
    
    //socket.emit("sound", mic);
}


function mousePressed() {
    var position = createVector(mouseX, mouseY);
    if(position.y >50) {
    if (drawfunctions.stroker) {
        hist.push(new Stroke(position));
        console.log("new stroke!");
        var data = {
        func: "stroker",
        x: mouseX,
        y: mouseY
    };
    }
    else if (drawfunctions.liner) {
        hist.push(new Line(position));
        console.log("new line!");
        var data = {
        func: "liner",
        x: mouseX,
        y: mouseY
    };
    }
    else if (drawfunctions.circle) {
        hist.push(new Circle(position));
        console.log("new circle!");
        var data = {
            func: "circle",
            x: mouseX,
            y: mouseY
        };
    }
    else if (drawfunctions.imager) {
        hist.push(new Imager(position));
        console.log("new image!");
        var data = {
            func: "imager",
            x: mouseX,
            y: mouseY
        };
    }
    else {
        console.log("no draw function selected");
    }
}
 
    socket.emit('start', data);
}

function mouseDragged() {
    var position = createVector(mouseX, mouseY);
    if(position.y >50) {
    hist[(hist.length - 1)].hist.push(position);
    //console.log(hist[0].hist[0]);
    var data = {
        x: mouseX,
        y: mouseY
    };
        
    socket.emit('mouse', data);
}
}

function Grid(vector) {
    this.hist = [vector, vector];
    
   // this.display = function() {
     //   for (var = i; i <)
    //}
}

function Circle(vector) {
    this.hist = [vector, vector];
    this.display = function() {
        rad = sqrt(sq((this.hist[0].x - this.hist[(this.hist.length - 1)].x)) + sq((this.hist[0].y - this.hist[(this.hist.length - 1)].y)));
         noFill();
         beginShape();
         ellipse(this.hist[0].x, this.hist[0].y, rad * 2);
         endShape();
    }
}

function Line(vector) {
    this.hist = [vector, vector];
    //this.hist = [vector, this.hist[(hist.length - 1)]];
    //this.hist.push(vector);
    
    
    //var position = createVector(mouseX, mouseY);
    //this.history[1] = postion;
    this.display = function() {
        beginShape();
        vertex(this.hist[0].x, this.hist[0].y);
        vertex(this.hist[(this.hist.length - 1)].x, this.hist[(this.hist.length - 1)].y);
        endShape();
    }

}



function Stroke(vector) {
    this.hist = [vector, vector];
    //this.hist.push(vector);
    
    this.display = function() {
        noFill();
        smooth();
        beginShape();
        for (var i = 0; i < this.hist.length; i++) {
            var pos = this.hist[i];
            vertex(pos.x, pos.y);
        }
        endShape();
    }   
}

function Imager(img, x, y) {
    this.x = x;
    this.y = y;

    this.display = function() {
        image(img, 50, 50, 200, 200);
    }   
}

function stroke_selector() {
        drawfunctions.stroker = true;
        drawfunctions.liner = false;
        drawfunctions.circle = false;
}
    
 function line_selector() {
        drawfunctions.stroker = false;
        drawfunctions.liner = true;
        drawfunctions.circle = false;
}

 function circle_selector() {
        drawfunctions.stroker = false;
        drawfunctions.liner = false;
        drawfunctions.circle = true;
}

function undoSend(){
   socket.emit("undo");
}

function undoer() {
 
    redo.push(hist[(hist.length - 1)]);
    console.log(hist.length);
    hist.pop();
    console.log(hist.length);
}

function redoSend() {
    socket.emit("redo");	
}

function redoer() {
    if(redo.length > 0) {
        hist.push(redo[(redo.length - 1)]);
        redo.pop();
    }
}

function fit() {
    canv = createCanvas(window.innerWidth, window.innerHeight);
    //canv.parent('canvas-holder');

    background(bground);
}

function clearPage() {
    hist = [];
    redo = [];
    console.log(hist.length);
    socket.emit("clear");
}






