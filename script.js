// var input = new CanvasInput({
//   canvas: document.getElementById('canvas'),
//   fontSize: 18,
//   fontFamily: 'Arial',
//   fontColor: '#212121',
//   fontWeight: 'bold',
//   width: 300,
//   padding: 8,
//   borderWidth: 1,
//   borderColor: '#000',
//   borderRadius: 3,
//   boxShadow: '1px 1px 0px #fff',
//   innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
//   placeHolder: 'Enter message here...'
// });
// --------------here is the code for the controller --------
class canvasController {
  constructor(canvasModel) {
    this.canvasModel = canvasModel;
    this.currcommand = null;
    this.currcommandType = null;

    // only need one instance of these commands 
    this.clearCommand = new ClearCommand(this.canvasModel) 
    this.eraserCommand = new EraserCommand(this.canvasModel)
  }
}

  canvasController.prototype.createCommand = function createCommand(commandType, e) {
    if (commandType == "clear" || commandType == "input" 
    || commandType == "mouse") {
      this.currcommand = null;
      this.currcommandType = null;
      if (commandType == "clear") {
        this.canvasModel.removeAllObservers();
        this.clearCommand.execute();
      }
      document.getElementsByTagName("body")[0].style.cursor = "default"

    }
    else {
      this.currcommandType = commandType;
      // if (this.currcommandType == "line"){
      //   this.currcommand = new LineCommand(this.canvasModel)
      // }
      
      if (this.currcommandType == "eraser"){
        document.getElementsByTagName("body")[0].style.cursor = 
        "url('images/eraserIcon.png'), auto";
        
      }
      else if(this.currcommandType == "line"){
        document.getElementsByTagName("body")[0].style.cursor = 
        "url('images/arrow-outline.png'), auto";

      }
      else{
        document.getElementsByTagName("body")[0].style.cursor = "default"

      }
    }

  }

  canvasController.prototype.updateModel = function updateModel(e) {
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
        this.currcommand = new CircleCommand(this.canvasModel);
      }
      else if (this.currcommandType == "circle2") {
        this.currcommand = new DoubleCircleCommand(this.canvasModel)
      }
      this.currcommand.setLocation(e)
      this.canvasModel.addObserver(this.currcommand);
    }
  }

//------------- Here is the code for the model------------

class canvasModel {
  constructor(canvas) {
    this.canvas = canvas;
    this.observers = [];
    this.bounds = this.canvas.getBoundingClientRect();
  }
}

  canvasModel.prototype.removeAllObservers = function removeAllObservers() {
    for (i = 0; i < this.observers.length; i++){
      if (this.observers[i].name == "CircleCommand" || this.observers[i].name
      == "DoubleCircleCommand"){
        this.observers[i].input.destroy();
      }

    } 
    this.observers =[];
}
  canvasModel.prototype.removeObserver = function  removeObserver(event) {
    let x =  event.clientX - this.bounds.left
    let y = event.clientY - this.bounds.top
   
    for (i = 0; i<this.observers.length; i++) {

      if (Math.abs(this.observers[i].xcord - x ) <= 35 &&
      Math.abs(this.observers[i].ycord - y) <= 35) {
        removed = this.observers[i];
        this.observers.splice(i, 1);
        return removed;
      }

      else if(this.observers[i].name == "LineCommand"){
        if (((this.observers[i].startx - 10 <= x && x <= this.observers[i].endx + 10)
        || (this.observers[i].startx + 10 >=  x && x >= this.observers[i].endx - 10))
        && ((this.observers[i].starty - 10 <= y && y <= this.observers[i].endy + 10) ||
        (this.observers[i].starty + 10 >= y && y >= this.observers[i].endy - 10))){
          // console.log("removed")
          removed = this.observers[i];
          this.observers.splice(i, 1);
          return removed;

        }
      }
  }
}

  canvasModel.prototype.addObserver = function   addObserver(object) {
    // must check that there is no object existing in that location
    isCircle = object.name == "CircleCommand" || object.name == "DoubleCircleCommand"
    isLine = object.name == "LineCommand"
    doesIntersect = false

    for (i = 0; i < this.observers.length; i++ ){
      currObserver = this.observers[i]
      if (currObserver == "LineCommand"){

        if (isLine){
          doesIntersect = checkLineLineIntersection(currObserver, object)
        }
        else{
          doesIntersect = checkCircleLineIntersection(currObserver, object)
        }
      }

      else if(isCircle){
        doesIntersect = checkCircleCircleIntersection(currObserver, object)
      }

      else{
        doesIntersect = checkCircleLineIntersection(currObserver, object)
      }
    }
    if (doesIntersect == false ){
      this.observers.push(object);
      object.execute(); // every command will have an execute method
    // console.log(this.observers.length)
    }

}

function checkCircleLineIntersection(circle, line){
  return false

}

function checkCircleCircleIntersection(circle1, circle2){
  return false
}

function checkLineLineIntersection(line1, line2){
  return false
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
class CircleCommand {
  constructor(canvasModel) {
    this.name = "CircleCommand";
    this.label = "";
    this.canvas = canvasModel.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.xcord = 0
    this.ycord = 0;
    this.input = null;
  }
}

  CircleCommand.prototype.setLocation = function setLocation(event) {
    let bounds = this.canvas.getBoundingClientRect();
    this.xcord = event.clientX - bounds.left;
    this.ycord = event.clientY - bounds.top;
}

  CircleCommand.prototype.execute = function execute() {
    this.ctx.beginPath();
    this.ctx.arc(this.xcord, this.ycord, 35, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.input = createDefaultLabel(this.xcord, this.ycord)

}

// --------- Double Cirlce Command ---------
class DoubleCircleCommand {
  constructor(canvasModel) {
    this.name = "DoubleCircleCommand";
    this.label = "";
    this.canvas = canvasModel.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.xcord = 0;
    this.ycord = 0;
    this.input = null;

  }

}

  DoubleCircleCommand.prototype.setLocation = function setLocation(event) {
    let bounds = this.canvas.getBoundingClientRect();
    this.xcord = event.clientX - bounds.left;
    this.ycord = event.clientY - bounds.top;
}

  DoubleCircleCommand.prototype.execute = function execute() {
    this.ctx.beginPath();
    this.ctx.arc(this.xcord, this.ycord, 35, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.xcord, this.ycord, 25, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.input = createDefaultLabel(this.xcord, this.ycord)


}

// ------- Clear Command -------
class ClearCommand {
  constructor(canvasModel) {
    this.name = "ClearCommand"
    this.canvas = canvasModel.canvas;
    // empty constructor

  }
}
  ClearCommand.prototype.execute = function execute() {
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width,
    this.canvas.height);

}


// ------- Erase Command -----
class EraserCommand {
  constructor(canvasModel) {
    this.name = "EraserCommand"
    this.canvas = canvasModel.canvas;
  }
}

  EraserCommand.prototype.execute = function execute(shape) {
    shape.ctx.beginPath();
    if (shape.name == "CircleCommand" || shape.name == "DoubleCircleCommand"){
      shape.input.destroy();
      shape.ctx.arc(shape.xcord, shape.ycord, 45, 0, 2 * Math.PI);
      shape.ctx.fillStyle = "white";
      shape.ctx.fill();
      shape.ctx.fillStyle = "black";
    }
    // must be a line
    else{
      shape.ctx.strokeStyle = "white";
      shape.ctx.lineWidth = 10;
      shape.execute();

      shape.ctx.strokeStyle = "black";
      shape.ctx.lineWidth = 1;


    }
}
// ---------- The Line Command ----------- //

class LineCommand{
  constructor(canvasModel){
    this.name = "LineCommand";
    this.canvas = canvasModel.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.bounds = this.canvas.getBoundingClientRect();
    this.startx = 0
    this.starty = 0
    this.endx = 0;
    this.endy = 0;
  }
}
  LineCommand.prototype.setLocationStart = function setLocationStart(event){
    this.startx = event.clientX - this.bounds.left;
    this.starty = event.clientY - this.bounds.top;
  }
  LineCommand.prototype.setLocation = function setLocation(event){
    this.endx = event.clientX - this.bounds.left;
    this.endy = event.clientY - this.bounds.top;

}
  LineCommand.prototype.execute = function execute(){
    this.ctx.beginPath();
    this.ctx.moveTo(this.endx, this.endy);
    this.ctx.lineTo(this.startx, this.starty);
    this.ctx.stroke();
    // console.log(this.startx, this.endx, this.starty, this.endy)


    this.ctx.beginPath();
    canvas_arrow(this.ctx, this.startx, this.starty, this.endx, this.endy)
    this.ctx.stroke();



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

let model = new canvasModel(document.getElementById("canvas"))
let controller = new canvasController(model);


const btnArr = [document.getElementById('circle'),
document.getElementById('circle2'), document.getElementById('line'),
document.getElementById('clear'), document.getElementById('eraser'),
document.getElementById("mouse")]



btnArr.forEach((button) => {
  button.addEventListener('click', (e) => {
    controller.createCommand(button.id, e);
  })
})


const canvasBtn = document.getElementById('canvas');


canvasBtn.addEventListener('click', (e) => {
  controller.updateModel(e);
})

document.addEventListener("mousedown", (e) => {
  if (controller.currcommandType == "line"){
    controller.currcommand = new LineCommand(controller.canvasModel)
    controller.currcommand.setLocationStart(e)
  }
})

// todo: should be able to edit any circle label without adding the current 
// selected shape

// todo: curvy transition which goes to the circle itself
// todo : undo button (have to store previous states of the canvas)