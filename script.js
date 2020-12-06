
// --------------here is the code for the controller --------
class canvasController {
  constructor(canvasModel) {
    this.canvasModel = canvasModel;
    this.currcommand = null;
    this.currcommandType = null;

    this.clearCommand = new ClearCommand(this.canvasModel) // only need one instance
    this.eraserCommand = new EraserCommand(this.canvasModel) // only need one instance

  }
}

  canvasController.prototype.createCommand = function createCommand(commandType, e) {
  this.currcommandType = commandType;
  if (this.currcommandType == "clear" || this.currcommandType == "input") {
  this.updateModel(e);
}

}

  canvasController.prototype.updateModel = function updateModel(e) {
  if (this.currcommandType == "clear") {
  this.currcommand = this.clearCommand;
  this.canvasModel.removeAllObservers();
  this.currcommand.execute();
}

else if(this.currcommandType == "input") {
  this.currcommand = new LabelCommand(this.canvasModel);
  this.currcommand.setLocation(e);
  this.canvasModel.addObserver(this.currcommand);
  this.currcommandType = null;
}

else if (this.currcommandType == "eraser") {
  this.currcommand = this.eraserCommand;
  res = this.canvasModel.removeObserver(e);
  if (res != null) {
  this.currcommand.execute(res);

}

}


else if (this.currcommandType != null) {
  // todo need to check that no other shape is in this spot
  if (this.currcommandType == "circle") {
  this.currcommand = new CircleCommand(this.canvasModel);
}
else {
  this.currcommand = new DoubleCircleCommand(this.canvasModel)
}
  this.currcommand.setLocation(e)
  this.canvasModel.addObserver(this.currcommand);
}
}

// canvasController.prototype.mouseDown = function mouseDown(e){
//   if (commandType == "clear"){
//     this.currcommand = this.eraserCommand;
//     res = this.canvasModel.removeObserver(e);
//     if (res != null){
//       this.currcommand.execute(res);
//     }

//   }

// }



//------------- Here is the code for the model------------

class canvasModel {
  constructor(canvas) {
    this.canvas = canvas;
    this.observers = [];
    this.bounds = this.canvas.getBoundingClientRect();
  }
}

  canvasModel.prototype.removeAllObservers = function removeAllObservers() {
  this.observers =[];
}
  canvasModel.prototype.removeObserver = function  removeObserver(event) {
  for (i = 0; i<this.observers.length; i++) {
  if (Math.abs(this.observers[i].xcord - (event.clientX - this.bounds.left))
  <= 35 &&
  Math.abs(this.observers[i].ycord - (event.clientY - this.bounds.top))
  <= 35) {
  removed = this.observers[i];
  this.observers.splice(i, 1);
  return removed;

}
}
}

  canvasModel.prototype.addObserver = function   addObserver(object) {
  this.observers.push(object);
  object.execute(); // every command will have an execute method

}



// --------- CirlceComamnd -------- //
class CircleCommand {
  constructor(canvasModel) {
    this.name = "CircleCommand";
    this.label = "";
    this.canvas = canvasModel.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.xcord = 0
    this.ycord = 0;
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
  shape.ctx.arc(shape.xcord, shape.ycord, 45, 0, 2 * Math.PI);
  shape.ctx.fillStyle = "white";
  shape.ctx.fill();

}

// ---------- The Label Command ----------- //
class LabelCommand {
  constructor(canvasModel) {
    this.name = "LabelCommand";
    this.canvas = canvasModel.canvas;
    this.xcord = 0;
    this.ycord = 0;
    this.txt = "";
  }
}

  LabelCommand.prototype.setLocation = function setLocation(event) {
  let bounds = this.canvas.getBoundingClientRect();
  this.xcord = event.clientX - bounds.left;
  this.ycord = event.clientY - bounds.top;
}



  LabelCommand.prototype.execute = function execute() {
  this.canvas.getContext('2d').fillText
  (document.getElementById("fname").value, this.xcord, this.ycord);
  this.txt = document.getElementById("fname").value;

}

// here we setup of the entire GUI MVC// 

let model = new canvasModel(document.getElementById("canvas"))
let controller = new canvasController(model);


const btnArr = [document.getElementById('circle'),
document.getElementById('circle2'), document.getElementById('arrow'),
document.getElementById('clear'), document.getElementById('eraser')]



btnArr.forEach((button) => {
  button.addEventListener('click', (e) => {
    controller.createCommand(button.id, e);
  })
})


const canvasBtn = document.getElementById('canvas');


canvasBtn.addEventListener('click', (e) => {
  // click = 1;
  // if (heldShift == 0){
  //   click = 0;
  //   controller.updateModel(e);

  // }
  console.log('hello')
  click ++
  if (click == 1) {
    timeout = setTimeout(function () {
      if (click == 1) {
        controller.updateModel(e);
      }
      click = 0;
    }, 300)
  }


})

canvasBtn.addEventListener('dblclick', (e) => {
  controller.createCommand('input', e);
})

// canvasBtn.addEventListener('keydown', (e) => {
//   console.log("hello");
//   if(e.code == 16){
//     heldShift = 1;
//     timeout = setTimeout(function (){
//       if (click == 1){
//         controller.createCommand('input', e);

//       }
//       else{
//         heldShift = 0;
//       }


//     }, 200)

//   }

// })

let heldShift = 0; // will help in differentiating between click and dbclick
let click = 0;

// todo: needs to act like an actual eraser (drag around canvas to erase) 
// todo: instead of double click to add Label, make it so that it is 
// done by holding down shift and then clicking
