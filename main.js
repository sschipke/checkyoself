// Variables & Query Selector
var title = document.querySelector('#title');
var taskItem = document.querySelector('#task');
var addTaskBtn = document.querySelector('.form__div--img');
var makeTaskBtn = document.querySelector('.form__btn--make');
var output = document.querySelector('output');
var clearBtn = document.querySelector('.form__btn--clear')
var rightSect = document.querySelector('section');
var todoArray = [];

//Event Listeners
addTaskBtn.addEventListener('click', addTaskHandler);
output.addEventListener('click', removeTaskItem);
clearBtn.addEventListener('click', clearAll);
makeTaskBtn.addEventListener('click', displayToDo);
window.addEventListener('load', handlePageload)
//Handlers

function addTaskHandler(){
  createTaskObj()
}

function handlePageload() {
  createTasksArray()
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
      debugger;
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


function createTasksArray(){
  localStorage.setItem('tasksArray', JSON.stringify([]))
}

function pushToStorage(array){
  localStorage.setItem('tasksArray', JSON.stringify(array))
}

function clearAll() {
  output.innerHTML = '';
  title.value = '';
  taskItem.value = '';
}

function displayToDo(){
  console.log(rightSect)
  rightSect.insertAdjacentHTML('afterbegin', 
  `<card class="section__card">
            <h2 class="card__h2">Title</h2>
            <ul class="card__ul">
              <li class="ul__li">
                <img src="images/checkbox.svg" class="li__img--check" alt ="task checkbox">
                <p class="li__p--card">Task</p>
              </li>
            </ul>
            <footer class="card__footer">
              <img src="images/urgent.svg" class="img--urgent" alt="urgent to do icon">
              <img src="images/delete.svg" class="image--delete" alt="to do delete icon">
            </footer>
          </card>`)
}