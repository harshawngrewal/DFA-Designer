
// --------------here is the code for the controller --------
class canvasController {
  constructor(canvasModel) {
    this.canvasModel = canvasModel;
  }
  updateModel() {
  }
}


//------------- Here is the code for the model------------

class canvasModel {
  constructor() {
    this.canvasView = document.getElementById("canvas");
    this.observers = [];
  }
  removeObserver(object) {
    for (i = 0; i < this.observers.length; i++) {
      if (this.observers[i] == object) {
        this.observers.pop(i);
      }

    }
  }
  addObserver(object) {
    this.observers.push(object);
    object.execute(); // every command will have an execute method

  }
  clear() {
    canvasView.clearRect(0, 0, canvas.width, canvas.height);
  }
}



// --------- CirlceComamnd -------- //
class CircleCommand {
  constructor(xcord, ycord) {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext('2d');
    this.xcord = xcord;
    this.ycord = ycord;
  }
}
CircleCommand.prototype.execute = function execute(){
  this.ctx.beginPath();
  this.ctx.arc(this.xcord, this.ycord, 35, 0, 2 * Math.PI);
  this.ctx.stroke();

}

// let circle = new CircleCommand(800, 50);
// circle.execute();










