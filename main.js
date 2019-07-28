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
makeTodoBtn.addEventListener('click', makeTodoBtnHandler)
rightSect.addEventListener('click', sectionHandler)
window.addEventListener('load', handlePageload)
//Handlers

function addTaskHandler(event){
  createTaskObj();
}

function makeTodoBtnHandler(){
  createTodo();
  showMessage(todoArray, 'Start by making some tasks!');
  clearAll();
  createTasksArray();
}

function handlePageload() {
  createTasksArray();
  reInstTodoArray();
  showMessage(todoArray, 'Start by making some tasks!');
}

function sectionHandler() {
  toggleTaskDone(event);
  removeTodo(event);
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
  }

function removeTaskItem(e) {
  if (e.target.classList.contains('li__img--dlt')) {
    e.target.closest('li').remove();
    var tasksArray = getTasksArray();
    var targetIndex = findTargetIndex(e, tasksArray, 'task-to-add');
    tasksArray.splice(targetIndex, 1);
    pushToStorage(tasksArray);
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
  showMessage(todoArray, 'Start by making some ToDos');
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
  var deletePath = obj.delete ? 'images/delete-active.svg' : 'images/delete.svg'
  rightSect.insertAdjacentHTML('afterbegin', 
  `<card class="section__card" data-id="${obj.id}">
            <h2 class="card__h2">${obj.title}</h2>
                ${populateTasks(obj.tasks)}</ul>
            <footer class="card__footer">
              <img src="images/urgent.svg" class="img--urgent" alt="urgent to do icon">
              <img src="${deletePath}" class="image--delete" alt="to do delete icon">
            </footer>
          </card>`)
}

function populateTasks(array){
  var uList = `<ul>`;
  array.forEach(function(task) {
    var checkPath = task.done ? 'images/checkbox-active.svg' : 'images/checkbox.svg';
    uList += `<li class="taskItem" data-id="${task.id}"><img src="${checkPath}" class="li__img--check" alt="Icon to check off task"> ${task.text} </li>`
  })
  return uList
}

function displayCards(array){
  array.forEach(function(todos){
    displayToDo(todos)
  })
}

function findTargetIndex(e, targetArray, className) {
  var id = e.target.closest('.' + className).dataset.id;
  var targetIndex = targetArray.findIndex(function(obj) {
    return parseInt(id) === obj.id
  })
  return targetIndex;
}

function toggleTaskDone(e){
  if (e.target.classList.contains('li__img--check')) {
  var todoIndex = findTargetIndex(e, todoArray, 'section__card');
  var listIndex = findTargetIndex(e, todoArray[todoIndex].tasks, 'taskItem');
  var task = todoArray[todoIndex].tasks[listIndex];
  var tasksArray = todoArray[todoIndex].tasks;
  task.done = !task.done;
  toggleCheckbox(e, task, listIndex);
  checkDeleteButton(e, tasksArray, todoArray[todoIndex]);
  todoArray[todoIndex].savetoStorage(todoArray);
  }
}

function checkDeleteButton(e,tasksArray, todo) {
  if (tasksArray.every(function(tasks){
    return tasks.done === true
  })) {
    e.target.closest('.section__card').querySelector('.image--delete').setAttribute('src', 'images/delete.svg');
    todo.delete = true;
  } else {e.target.closest('.section__card').querySelector('.image--delete').setAttribute('src', 'images/delete-active.svg');
  todo.delete = false;
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

function removeTodo(e){
  if (e.target.classList.contains('image--delete')){
    var targetIndex = findTargetIndex(e, todoArray, 'section__card');
    todoArray[targetIndex].deleteFromStorage(todoArray, targetIndex);
    e.target.closest('.section__card').remove();
  }
  showMessage(todoArray, 'Start by making some ToDos')
}

function clearCards() {
  rightSect.innerHTML = ''
}

function showMessage(array, message) {
  if (array.length === 0) {
    rightSect.insertAdjacentHTML('afterbegin', `<h3 id='h3tag'>${message}</h3>`);
    return;
  } else {
    clearCards();
    displayCards(array)
  }
}