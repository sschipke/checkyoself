class TodoList {
  constructor(obj) {
    this.title = obj.title;
    this.item = obj.id;
    this.id = obj.id || Date.now();
    this.tasks = obj.tasks;
    this.urgent = obj.urgent || false;
  }
  savetoStorage() {

  }

  deleteFromStorage() {

  }

  updateToDo(){

  }

  updateTask() {
    
  }
}