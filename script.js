
// here is the code for the controller
function canvasController(canvasView, canvasModel) {
  this.canvasView = canvasView;
  this.canvasModel = canvasModel;
}

canvasController.prototype.updateModel = function updateModel() {

}

// here is the code for the model
function canvasModel() {
  this.observers = [];
  observers.push("wassup")
}

canvasModel.prototype.removeObserver = function removeObserver(object){
  for(i = 0; i< this.observers.length; i ++){
  if (this.observers[i] == object) {
    this.observer.pop(i);
  }

}
}


