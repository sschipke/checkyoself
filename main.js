// Variables & Query Selector
var searchInput = document.querySelector('.header__input--search')
var titleIn = document.querySelector('#title');
var taskItem = document.querySelector('#task');
var addTaskBtn = document.querySelector('.form__btn--task');
var makeTodoBtn = document.querySelector('.form__btn--make');
var output = document.querySelector('output');
var clearBtn = document.querySelector('.form__btn--clear');
var filterBtn = document.querySelector('.aside__button')
var rightSect = document.querySelector('section');
var todoArray = [];

//Event Listeners
addTaskBtn.addEventListener('click', addTaskHandler);
output.addEventListener('click', removeTaskItem);
clearBtn.addEventListener('click', clearAll);
makeTodoBtn.addEventListener('click', makeTodoBtnHandler);
rightSect.addEventListener('click', sectionHandler);
filterBtn.addEventListener('click', filterHandler);
searchInput.addEventListener('keyup', searchHandler)
window.addEventListener('load', handlePageload);
//Handlers

function addTaskHandler(){ 
  if (taskItem.value === '') {
    return
  } else {
  createTaskObj();
  }
}

function makeTodoBtnHandler(){
  var tasksArray = getTasksArray();
  if (titleIn.value !== '' || tasksArray.length !== 0) {
  createTodo();
  showMessage(todoArray, 'Start by making some tasks!');
  clearAll();
  createTasksArray();
  }
}


function handlePageload() {
  createTasksArray();
  reInstTodoArray();
  showMessage(todoArray, 'Start by making some todos!');
}

function sectionHandler() {
  toggleTaskDone(event);
  removeTodo(event);
  updateUrgency(event);
}

function filterHandler() {
  if (filterBtn.classList.contains('filter')) { 
    deactivateFilterBtn();
    showMessage(todoArray, 'Start by making some todos!');
    clearSearchInput();
  } else {
    clearSearchInput();
    activateFilterBtn();
    filterByUrgent();
  }
}

function searchHandler() {
  if (filterBtn.classList.contains('filter')){
    searchUrgents();
  } else {
    searchTitle();
  }
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
  var deletePath = obj.delete ? 'images/delete-active.svg' : 'images/delete.svg';
  var deleteClass = obj.delete ? 'delete--card' : ''
  var urgentPath = obj.urgent ? 'images/urgent-active.svg' :'images/urgent.svg';
  var urgentClass = obj.urgent ? 'urgent' : ''
  rightSect.insertAdjacentHTML('afterbegin', 
  `<article class="section__card ${urgentClass}" data-id="${obj.id}">
            <h2 class="card__h2">${obj.title}</h2>
                ${populateTasks(obj.tasks)}</ul>
            <footer class="card__footer">
              <div class="footer__div--urgent">
                <img src="${urgentPath}" class="img--urgent" alt="urgent to do icon">
                <p class="div__urgent--p"> URGENT </p>
              </div>
              <div class="footer__div--delete">
                <img src="${deletePath}" class="image--delete ${deleteClass}" alt="to do delete icon">
                <p class="div__delete--p"> DELETE </p>
              </div>
            </footer>
          </article>`)
}

function populateTasks(array){
  var uList = `<ul class>`;
  array.forEach(function(task) {
    var checkPath = task.done ? 'images/checkbox-active.svg' : 'images/checkbox.svg';
    uList += `<li class="taskItem" data-id="${task.id}"><img src="${checkPath}" class="li__img--check" alt="Icon to check off task"> ${task.text} </li>`
  });
  return uList;
}

function displayCards(array){
  array.forEach(function(todos){
    displayToDo(todos)
  });
}

function findTargetIndex(e, targetArray, className) {
  var id = e.target.closest('.' + className).dataset.id;
  var targetIndex = targetArray.findIndex(function(obj) {
    return parseInt(id) === obj.id
  });
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
  var deleteBtn = e.target.closest('.section__card').querySelector('.image--delete')
  if (tasksArray.every(function(tasks){
    return tasks.done === true
  })) {
    enableDeleteBtn(deleteBtn);
    todo.delete = true;
  } else {
  disableDeleteBtn(deleteBtn);
  todo.delete = false;
  }
}

function enableDeleteBtn(button) {
  button.setAttribute('src', 'images/delete-active.svg');
  button.classList.add('delete--card');
}

function disableDeleteBtn(button) {
  button.setAttribute('src', 'images/delete.svg');
  button.classList.remove('delete--card');
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
  if (e.target.classList.contains('delete--card')){
    var targetIndex = findTargetIndex(e, todoArray, 'section__card');
    todoArray[targetIndex].deleteFromStorage(todoArray, targetIndex);
    e.target.closest('.section__card').remove();
    showMessage(todoArray, 'Start by making some ToDos')
  }
}

function clearCards() {
  rightSect.innerHTML = ''
}

function showMessage(array, message) {
  if (!array.length) {
    rightSect.insertAdjacentHTML('afterbegin', `<h3 id='h3tag'>${message}</h3>`);
    return;
  } else {
    clearCards();
    displayCards(array)
  }
}

function updateUrgency(e) {
if (e.target.classList.contains('img--urgent')) {
  var targetIndex = findTargetIndex(e, todoArray, 'section__card');
  var targetTodo = todoArray[targetIndex];
  targetTodo.updateToDo(todoArray);
  changeUrgentStyle(e, targetTodo);
  }
}

function changeUrgentStyle(e, targetTodo) {
  if (targetTodo.urgent) {
    e.target.setAttribute('src', 'images/urgent-active.svg');
    e.target.closest('.section__card').classList.add('urgent');
  } else {
    e.target.setAttribute('src', 'images/urgent.svg');
    e.target.closest('.section__card').classList.remove('urgent');
  }
}

function filterByUrgent() {
  clearCards();
  var urgentArray = [];
  todoArray.forEach(function(urgentTodos){
    if (urgentTodos.urgent === true){
      urgentArray.push(urgentTodos);
    };
  });
  showMessage(urgentArray, 'Relax! No pending URGENT items.')
}

function activateFilterBtn() {
  filterBtn.classList.add('filter');
}

function deactivateFilterBtn() {
  filterBtn.classList.remove('filter')
}

function searchTitle() {
  clearCards();
  var searchArray = [];
  todoArray.forEach(function(todos){
    if (todos.title.toLowerCase().includes(searchInput.value.toLowerCase())) {
      searchArray.push(todos)
    }
  })
  displayCards(searchArray);
}

function searchUrgents() {
  clearCards();
  var searchUrgentArray = [];
  todoArray.forEach(function(todos){
    if (todos.urgent === true && todos.title.toLowerCase().includes(searchInput.value.toLowerCase())) {
      searchUrgentArray.push(todos);
    }
  })
  displayCards(searchUrgentArray);
}

function clearSearchInput() {
  searchInput.value = '';
}