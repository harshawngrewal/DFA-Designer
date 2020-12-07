
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
    if (commandType == "clear" || commandType == "input") {
      if (commandType == "clear") {
        this.canvasModel.removeAllObservers();
        this.clearCommand.execute();
      }
      else {
        command = new LabelCommand(this.canvasModel);
        command.setLocation(e);
        this.canvasModel.addObserver(command);
      }
    }
    else {
      this.currcommandType = commandType;
    }
  }

  canvasController.prototype.updateModel = function updateModel(e) {
    if (this.currcommandType == "eraser") {
      this.currcommand = this.eraserCommand;
      res = this.canvasModel.removeObserver(e);
      
      if (res != null) {
        this.currcommand.execute(res);
      }
    }

    else if (this.currcommandType != null) {
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
    console.log(this.observers.length)

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
  clickevent = e;
  if (heldShift == 1) {
    click = 1;
  }
  else {
    controller.updateModel(e);

  }

})

document.addEventListener('keydown', (e) => {
  if (e.code == "ShiftLeft") {
    heldShift = 1;
    function Timeout() {
      timeout = setTimeout(function () {

        if (click == 1 && heldShift == 1) {
          controller.createCommand('input', clickevent);
        }
        if (heldShift == 1) {
          Timeout();
        }
        click = 0;


      }, 100)

    }
    Timeout();
  }

})

document.addEventListener('keyup', (e) => {
  if (e.code == "ShiftLeft") {
    heldShift = 0;
  }

})

let heldShift = 0; // will help to identify shift + click
let click = 0; // will help to identify shift + click
let clickevent = null;

// todo: needs to act like an actual eraser (drag around canvas to erase) 
// todo: instead of double click to add Label, make it so that it is 
// done by holding down shift and then clicking
