class TodoList {
  constructor(obj) {
    this.title = obj.title;
    this.item = obj.id;
    this.id = obj.id || Date.now();
    this.tasks = obj.tasks;
    this.urgent = obj.urgent || false;
    this.delete = obj.delete || false;
  }
  savetoStorage(array) {
  localStorage.setItem('todoArray', JSON.stringify(array))
  }

  deleteFromStorage(todoArray, neededIndex) {
    todoArray.splice(neededIndex, 1);
    this.savetoStorage(todoArray);
  }

  updateToDo(array){
    this.urgent = !this.urgent;
    this.savetoStorage(array)
  }

  updateTask() {
    
  }
}