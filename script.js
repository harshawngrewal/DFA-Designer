
// --------------here is the code for the controller --------
class canvasController {
  constructor(canvasModel) {
    this.canvasModel = canvasModel;
    this.currcommand = null;
  }
}

canvasController.prototype.createCommand = function createCommand(commandType){
  if (commandType == "circle"){
    this.currcommand = new CircleCommand();
    // this line is for testing purposes this.currcommand.execute();
  }
  else if(commandType == "circle2"){
    this.currcommand = new DoubleCircleCommand()
  }

}

canvasController.prototype.updateModel = function updateModel(e){
  if (this.currcommand != null){
    this.currcommand.setLocation(e)
    this.canvasModel.addObserver(this.currcommand);
}
}



//------------- Here is the code for the model------------

class canvasModel {
  constructor() {
    this.canvasView = document.getElementById("canvas");
    this.observers = [];
  }
}

canvasModel.prototype.clear = function clear() {
  console.log("hello");
  this.canvasView.getContext("2d").clearRect(0, 0, this.canvasView.width, 
    this.canvasView.height);
}

canvasModel.prototype.removeObserver = function  removeObserver(object) {
  for (i = 0; i < this.observers.length; i++) {
    if (this.observers[i] == object) {
      this.observers.pop(i);
    }

  }
}

canvasModel.prototype.addObserver = function   addObserver(object) {
  this.observers.push(object);
  object.execute(); // every command will have an execute method

}



// --------- CirlceComamnd -------- //
class CircleCommand {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext('2d');
    this.xcord = 0
    this.ycord = 0;
  }
}

CircleCommand.prototype.setLocation = function setLocation(event){
  let bounds = this.canvas.getBoundingClientRect();
  this.xcord = event.clientX - bounds.left ;
  this.ycord = event.clientY - bounds.top;
}

CircleCommand.prototype.execute = function execute(){
  this.ctx.beginPath();
  this.ctx.arc(this.xcord, this.ycord, 35, 0, 2 * Math.PI);
  this.ctx.stroke();

}


class DoubleCircleCommand{
  constructor(){
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext('2d');
    this.xcord = 0;
    this.ycord = 0;

  }
  
}


DoubleCircleCommand.prototype.setLocation = function setLocation(event){
  let bounds = this.canvas.getBoundingClientRect();
  this.xcord = event.clientX - bounds.left ;
  this.ycord = event.clientY - bounds.top;
}

DoubleCircleCommand.prototype.execute = function execute(){
  this.ctx.beginPath();
  this.ctx.arc(this.xcord, this.ycord, 35, 0, 2 * Math.PI);
  this.ctx.stroke();

  this.ctx.beginPath();
  this.ctx.arc(this.xcord, this.ycord, 25, 0, 2 * Math.PI);
  this.ctx.stroke();

}


// here we setup of the entire GUI MVC// 

let model = new canvasModel()
let controller = new canvasController(model);


const btnArr = [document.getElementById('circle'), 
document.getElementById('circle2'), document.getElementById('arrow'), 
document.getElementById('clear')]


btnArr.forEach((button) => {
  button.addEventListener('click', () => {
    controller.createCommand(button.id);
  })
})

const canvasBtn = document.getElementById('canvas');
canvasBtn.addEventListener('click',(e) =>{
  controller.updateModel(e);

})