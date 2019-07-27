// Variables & Query Selector
var titleIn = document.querySelector('#title');
var taskItem = document.querySelector('#task');
var addTaskBtn = document.querySelector('.form__div--img');
var makeTodoBtn = document.querySelector('.form__btn--make');
var output = document.querySelector('output');
var clearBtn = document.querySelector('.form__btn--clear')
var rightSect = document.querySelector('section');
var todoArray = [];

//Event Listeners
addTaskBtn.addEventListener('click', addTaskHandler);
output.addEventListener('click', removeTaskItem);
clearBtn.addEventListener('click', clearAll);
makeTodoBtn.addEventListener('click', createTodo)
rightSect.addEventListener('click', sectionHandler)
window.addEventListener('load', handlePageload)
//Handlers

function addTaskHandler(event){
  createTaskObj();
}

function makeTodoBtnHandler(){
  createTodo();
  clearAll();
}

function handlePageload() {
  createTasksArray();
  reInstTodoArray();
  displayCards(todoArray)
}

function sectionHandler() {
  toggleTaskDone(event);
}



//Functions
function addTask(obj) {
  output.insertAdjacentHTML('beforeend', 
  ` <li class="task-to-add" data-id=${obj.id}>
  <img src="images/delete.svg" class="li__img--dlt" alt="delete task icon"> ${obj.text}</p>
  </li>`);
  taskItem.value = '';
}
function createTaskObj(){
  var task = {
      id: Date.now(),
      text: taskItem.value,
      done: false }
    var tasksArray = JSON.parse(localStorage.getItem('tasksArray'));
    tasksArray.push(task);
    pushToStorage(tasksArray)
    addTask(task)
    console.log(task)
  }

function removeTaskItem(e) {
  if (e.target.classList.contains('li__img--dlt')) {
    e.target.closest('li').remove();
  }
}

function getTasksArray() {
  return JSON.parse(localStorage.getItem('tasksArray'));
}

function createTasksArray(){
  localStorage.setItem('tasksArray', JSON.stringify([]));
}

function pushToStorage(array){
  localStorage.setItem('tasksArray', JSON.stringify(array));
}

function clearAll() {
  output.innerHTML = '';
  title.value = '';
  taskItem.value = '';
}

function createTodo() {
  var tasksArray = JSON.parse(localStorage.getItem('tasksArray'));
  var todo = new TodoList({title:titleIn.value, tasks: tasksArray});
  todoArray.push(todo);
  todo.savetoStorage(todoArray);
  displayToDo(todo)
}

function reInstTodoArray() {
  if (JSON.parse(localStorage.getItem('todoArray')) === null) {
    todoArray = [];
  } else {
    todoArray = JSON.parse(localStorage.getItem('todoArray')).map(element => {
      return new TodoList(element);
    })
  }
}

function displayToDo(obj){
  rightSect.insertAdjacentHTML('afterbegin', 
  `<card class="section__card" data-id="${obj.id}">
            <h2 class="card__h2">${obj.title}</h2>
                ${populateTasks(obj.tasks)}</ul>
            <footer class="card__footer">
              <img src="images/urgent.svg" class="img--urgent" alt="urgent to do icon">
              <img src="images/delete.svg" class="image--delete" alt="to do delete icon">
            </footer>
          </card>`)
}

function populateTasks(array){
  var uList = `<ul>`;
  array.forEach(function(task) {
    uList += `<li class="taskItem" data-id="${task.id}"><img src="images/checkbox.svg" class="li__img--check" alt="Icon to check off task"> ${task.text} </li>`
  })
  return uList
}

function displayCards(array){
  array.forEach(function(todos){
    displayToDo(todos)
  })
}

function testy(e){
  if (e.target.classList.contains('li__img--check')) {
  }
}

function findTargetIndex(e, targetArray, className) {
  var id = e.target.closest('.' + className).dataset.id;
  var targetIndex = targetArray.findIndex(function(obj) {
    return parseInt(id) === obj.id
  })
  return targetIndex;
}

function toggleTaskDone(e){
  var todoIndex = findTargetIndex(e, todoArray, 'section__card');
  var listIndex = findTargetIndex(e, todoArray[todoIndex].tasks, 'taskItem');
  var task = todoArray[todoIndex].tasks[listIndex];
  var tasksArray = todoArray[todoIndex].tasks;
  task.done = !task.done;
  toggleCheckbox(e, task, listIndex);
  checkDeleteButton(e, tasksArray);
}

function checkDeleteButton(e,tasksArray) {
  if (tasksArray.every(function(tasks){
    return tasks.done === true
  })) {
    e.target.closest('.section__card').querySelector('.image--delete').setAttribute('src', 'images/delete.svg')
  } else {e.target.closest('.section__card').querySelector('.image--delete').setAttribute('src', 'images/delete-active.svg')
  }
}

function toggleCheckbox(e, task, liIndex){
  var checked = 'images/checkbox-active.svg';
  var unchecked = 'images/checkbox.svg';
  var imgArray = e.target.closest('.section__card').querySelectorAll('.li__img--check');
  targetImage = imgArray[liIndex];
  if (task.done === true) {
    targetImage.setAttribute('src', checked)
  } else {
    targetImage.setAttribute('src', unchecked)
  }
}