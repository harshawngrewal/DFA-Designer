//Global variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const bounds = canvas.getBoundingClientRect();


// --------------here is the code for the controller --------
function canvasController(model) {
  this.canvasModel = model;
  this.currcommand = null;
  this.currcommandType = null;

  // only need one instance of these commands 
  this.clearCommand = new ClearCommand();
  this.eraserCommand = new EraserCommand();
}

  canvasController.prototype.createCommand =  function(commandType, e){
    if (commandType == "clear" || commandType == "input" 
    || commandType == "mouse") {
      this.currcommand = null;
      this.currcommandType = null;
      if (commandType == "clear") {
        this.canvasModel.removeAllObservers();
        this.clearCommand.execute();
      }
      document.getElementsByTagName("body")[0].style.cursor = "default";

    }
    else {
      this.currcommandType = commandType;
    }

  }

  canvasController.prototype.updateModel = function (e){
    if (this.currcommandType == "eraser") {
      this.currcommand = this.eraserCommand;
      res = this.canvasModel.removeObserver(e);
      
      if (res != null) {
        // console.log(res)
        this.currcommand.execute(res);
      }
    }

    else if (this.currcommandType != null) {
      if (this.currcommandType == "circle") {
        this.currcommand = new CircleCommand();
      }
      else if (this.currcommandType == "circle2") {
        this.currcommand = new DoubleCircleCommand();
      }
      this.currcommand.setLocation(e);
      this.canvasModel.addObserver(this.currcommand);
    }
  }

//------------- Here is the code for the model------------

function canvasModel () {
  this.observers = [];
}

  canvasModel.prototype.removeAllObservers = function(){
    for (i = 0; i < this.observers.length; i++){
      if (this.observers[i].name == "CircleCommand" || this.observers[i].name
      == "DoubleCircleCommand"){
        this.observers[i].input.destroy();
      }

    } 
    this.observers =[];
}
  canvasModel.prototype.removeObserver = function(event){
    let x =  event.clientX - bounds.left;
    let y = event.clientY - bounds.top;
   
    for (i = 0; i<this.observers.length; i++) {
      let shape = this.observers[i];
      // console.log(shape.startx, shape.endx, shape.starty, shape.endy, shape.m ,y);

      if(this.observers[i].name == "LineCommand"){
        if (((shape.startx - 5 <= x && x <= shape.endx + 5) || (shape.startx + 5 >=  x &&
           x >= shape.endx - 5)) && Math.abs(shape.m * x + shape.b - y) <= 15){

          removed = this.observers[i];
          this.observers.splice(i, 1);
          return removed;

        }
      }
      
      else if (Math.abs(this.observers[i].xcord - x ) <= 35 &&
      Math.abs(this.observers[i].ycord - y) <= 35) {
        removed = this.observers[i];
        this.observers.splice(i, 1);
        return removed;
      }
  }
}

canvasModel.prototype.addObserver = function(object){
  // must check that there is no object existing in that location
  let isCircle = object.name == "CircleCommand" || object.name == "DoubleCircleCommand";
  let isLine = object.name == "LineCommand";
  let doesIntersect = false;
  // console.log("checkpoint", isCircle, isLine)

  for (i = 0; i < this.observers.length; i++ ){
    let currObserver = this.observers[i]
    if (currObserver.name == "LineCommand"){


      if (isLine){
        doesIntersect = checkLineLineIntersection(currObserver, object);
      }
      else{
        doesIntersect = checkCircleLineIntersection(currObserver, object);
      }
    }

    else if(isCircle){
      doesIntersect = checkCircleCircleIntersection(currObserver, object);
    }

    else{
      doesIntersect = checkCircleLineIntersection(currObserver, object);
    }
    if (doesIntersect){
      return;
    }
  }
  if (doesIntersect == false ){
    this.observers.push(object);
    object.execute(); // every command will have an execute method
  // console.log(this.observers.length)
  }

}

function checkCircleLineIntersection(circle, line){
  var b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
  v1 = {};
  v2 = {};
  v1.x = line.endx - line.startx;
  v1.y = line.endy - line.starty;
  v2.x = line.startx - circle.xcord;
  v2.y = line.starty - circle.ycord;
  b = (v1.x * v2.x + v1.y * v2.y);
  c = 2 * (v1.x * v1.x + v1.y * v1.y);
  b *= -2;
  d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - 35 * 35));
  if(isNaN(d)){ // no intercept
    return false;
  }
  u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
  u2 = (b + d) / c;    
  retP1 = {};   // return points
  retP2 = {};
  ret = []; // return array
  if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
      retP1.x = line.startx + v1.x * u1;
      retP1.y = line.stat + v1.y * u1;
      ret[0] = retP1;
  }
  if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
      retP2.x = line.startx + v1.x * u2;
      retP2.y = line.starty + v1.y * u2;
      ret[ret.length] = retP2;
  }
  return ret.length > 0;    
 }

function checkCircleCircleIntersection(circle1, circle2){
  let distance =Math.sqrt((circle1.xcord - circle2.xcord) ** 2 +
    (circle1.ycord - circle2.ycord) **2);
  
  if (distance < 70){
    return true;
  }
  return false;
}

function checkLineLineIntersection(line1, line2){
  return false;
  // if (line1.m == line2.m){
  //   return line1.b == line2.b
  // }

  // intersection = (line2.b - line1.b)/(line1.m - line2.m)
  // contains_intersect1 =  (line1.startx <= intersection && intersection <= line1.endx) ||
  //   (line1.endx <= intersection && intersection <= line1.startx)
  // contains_intersect2 =  (line2.startx <= intersection && intersection <= line2.endx) ||
  //   (line2.endx <= intersection && intersection <= line2.startx)


  // if (contains_intersect1 && contains_intersect2){
  //     return true
  //   }
  // return false
}


function createDefaultLabel(x1, y1){
  return new CanvasInput({
    canvas: document.getElementById('canvas'),
    x: x1 - 22,
    y: y1 - 10,
    width: 30,
    height: 8,
    fontSize: 10
  });

}


// --------- CircleCommand -------- //
function CircleCommand () {
  this.name = "CircleCommand";
  this.label = "";
  this.xcord = 0;
  this.ycord = 0;
  this.input = null;
}

  CircleCommand.prototype.setLocation = function setLocation(event) {
    let bounds = canvas.getBoundingClientRect();
    this.xcord = event.clientX - bounds.left;
    this.ycord = event.clientY - bounds.top;
}

  CircleCommand.prototype.execute = function(){
    ctx.beginPath();
    ctx.arc(this.xcord, this.ycord, 35, 0, 2 * Math.PI);
    ctx.stroke();
    this.input = createDefaultLabel(this.xcord, this.ycord);
}

// --------- Double Cirlce Command ---------
function DoubleCircleCommand () {
  this.name = "DoubleCircleCommand";
  this.label = "";
  this.xcord = 0;
  this.ycord = 0;
  this.input = null;

}

  DoubleCircleCommand.prototype.setLocation = function(e) {
    let bounds = canvas.getBoundingClientRect();
    this.xcord = event.clientX - bounds.left;
    this.ycord = event.clientY - bounds.top;
}

  DoubleCircleCommand.prototype.execute = function(){
    ctx.beginPath();
    ctx.arc(this.xcord, this.ycord, 35, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.xcord, this.ycord, 25, 0, 2 * Math.PI);
    ctx.stroke();
    this.input = createDefaultLabel(this.xcord, this.ycord);

}

// ------- Clear Command -------
function ClearCommand () {
  this.name = "ClearCommand"
    // empty constructor
}

  ClearCommand.prototype.execute = function(){
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}


// ------- Erase Command -----
function EraserCommand () {
  this.name = "EraserCommand";
}

  EraserCommand.prototype.execute = function(shape){
    ctx.beginPath();
    if (shape.name == "CircleCommand" || shape.name == "DoubleCircleCommand"){
      if(shape.input){
        shape.input.destroy();
      }
      ctx.arc(shape.xcord, shape.ycord, 45, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.fillStyle = "black";
    }
    // must be a line
    else{
      ctx.strokeStyle = "white";
      ctx.lineWidth = 10;
      shape.execute();

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;


    }
}
// ---------- The Line Command ----------- //

function LineCommand(){
  this.name = "LineCommand";
  this.startx = 0;
  this.starty = 0;
  this.endx = 0;
  this.endy = 0;
  this.m = 0;
  this.b;
}
  LineCommand.prototype.setLocationStart = function(event){
    this.startx = event.clientX - bounds.left;
    this.starty = event.clientY - bounds.top;
  }
  LineCommand.prototype.setLocation = function(event){
    this.endx = event.clientX - bounds.left;
    this.endy = event.clientY - bounds.top;
    if (this.endx - this.startx != 0){
      this.m = (this.endy - this.starty)/(this.endx - this.startx);
      this.b = this.starty - this.m*this.startx;
    }

}
  LineCommand.prototype.execute = function(){
    ctx.beginPath();
    ctx.moveTo(this.endx, this.endy);
    ctx.lineTo(this.startx, this.starty);
    ctx.stroke();
    // console.log(this.startx, this.endx, this.starty, this.endy)


    ctx.beginPath();
    canvas_arrow(ctx, this.startx, this.starty, this.endx, this.endy);
    ctx.stroke();



  }

function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}



// here we setup of the entire GUI MVC// 

let model = new canvasModel(canvas);
let controller = new canvasController(model);

const btnArr = [document.getElementById('circle'),
document.getElementById('circle2'), document.getElementById('line'),
document.getElementById('clear'), document.getElementById('eraser'),
document.getElementById("mouse")];



btnArr.forEach((button) => {
  button.addEventListener('click', (e) => {
    controller.createCommand(button.id, e);
  })
})


canvas.addEventListener('click', (e) => {
  controller.updateModel(e);
  update_storage();
})

document.addEventListener("mousedown", (e) => {
  if (controller.currcommandType == "line"){
    controller.currcommand = new LineCommand(controller.canvasModel);
    controller.currcommand.setLocationStart(e);
  }
})


function download(){
  var download = document.getElementById("download");
  var image = canvas.toDataURL("image/png")
              .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}

function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function update_storage(){
  localStorage.setItem("canvas", canvas.toDataURL());
  localStorage.setItem("observers", JSON.stringify(model.observers));
}

function load_storage(){
  if(localStorage.getItem("canvas")){
    var dataURL = localStorage.getItem("canvas");
    var img = new Image;
    img.src = dataURL;
    img.onload = function () {
      canvas.getContext('2d').drawImage(img, 0, 0);
  }
    let temp_arr = JSON.parse(localStorage.getItem("observers") || "[]")

    for(i = 0; i < temp_arr.length; i ++){
      let temp_observer;
      if (temp_arr[i].name == "LineCommand"){
        temp_observer = new LineCommand();
        temp_observer.startx = temp_arr[i].startx;
        temp_observer.endx = temp_arr[i].endx;
        temp_observer.starty = temp_arr[i].starty;
        temp_observer.endy = temp_arr[i].endy;
        temp_observer.m = temp_arr[i].m;
        temp_observer.b = temp_arr[i].b;


      }
      else if (temp_arr[i].name == "CircleCommand"){
        temp_observer = new CircleCommand();
        temp_observer.xcord = temp_arr[i].xcord;
        temp_observer.ycord = temp_arr[i].ycord;
      }
      else{
        temp_observer = new DoubleCircleCommand();
        temp_observer.xcord = temp_arr[i].xcord;
        temp_observer.ycord = temp_arr[i].ycord;
      }

      model.observers.push(temp_observer);
  
    }
}

}
// localStorage.clear();
load_storage();
loadScript('CanvasInput-master/CanvasInput.js');

// todo: curvy transition which goes to the circle itself
// todo : undo button (have to store previous states of the canvas)
// be able to store the object in local storage