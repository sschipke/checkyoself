// Variables & Query Selector
var title = document.querySelector('#title');
var taskItem = document.querySelector('#task');
var addTaskBtn = document.querySelector('.form__div--img');
var makeTaskBtn = document.querySelector('.form__btn--make');
var output = document.querySelector('output');
var clearBtn = document.querySelector('.form__btn--clear')

//Event Listeners
addTaskBtn.addEventListener('click', addTask)
output.addEventListener('click', deleteTaskItem)
clearBtn.addEventListener('click', clearAll)


//Functions
function addTask() {
  output.insertAdjacentHTML('beforeend', 
  ` <li class="task-to-add">
  <img src="images/delete.svg" class="li__img--dlt" alt="delete task icon"><p class="li__p--task"> ${taskItem.value}</p>
  </li>`);
  taskItem.value = '';
}

function deleteTaskItem(e) {
  if (e.target.classList.contains('li__img--dlt')) {
    e.target.closest('li').remove();
  }
}

function clearAll() {
  output.innerHTML = '';
  title.value = '';
  taskItem.value = '';
}