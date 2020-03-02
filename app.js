/**
 * Todo App DOM Elements
 */
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const area = document.querySelector('#todo-area');
const filter = document.querySelector('#todo-filter');
const clear = document.querySelector('#todo-clear');

eventListener();

/**
 * Event Listeners
 */
function eventListener() {
  form.addEventListener('submit', addTodo);
  document.addEventListener('DOMContentLoaded', loadAllTodosToUI);
  clear.addEventListener('click', clearAllTodos);
  list.addEventListener('click', removeTodo);
  filter.addEventListener('keyup', filterTodos);
}

/**
 * Add Action
 * @param {Event} e
 */
function addTodo(e) {
  const todo = input.value.trim();

  if (todo === '') {
    showAlert('danger', 'Please enter a todo content')
  } else {
    appendToUI(todo);
    addTodoToSorage(todo);
  }
  e.preventDefault();
}

/**
 * Append todo to user interface.
 * @param {String} todo
 */
function appendToUI(todo, type = 'new') {
  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  (type === 'new')
    ? item.classList.add('bg-success', 'text-white')
    : null;

  const content = document.createElement('span');
  content.appendChild(document.createTextNode(todo));

  const button = document.createElement('button');
  button.className = 'delete-item btn btn-danger btn-sm';
  button.dataset.action = 'delete';
  button.innerHTML = 'Remove';

  item.appendChild(content);
  item.appendChild(button);
  list.appendChild(item);
  input.value = '';
  hideAlert();

  (type === 'new')
    ? setTimeout(() => {
      const newItems = document.querySelectorAll('.bg-success.text-white');
      for (let i = 0; i < newItems.length; i++) {
        newItems[i].classList.remove('text-white', 'bg-success');
      }
    }, 1000) : null;
}

function getTodosFromStorage() {
  let todos;

  (localStorage.getItem('todos') === null)
    ? todos = []
    : todos = JSON.parse(localStorage.getItem('todos'));

  return todos;
}

function addTodoToSorage(todo) {
  let todos = getTodosFromStorage();
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(todo => {
    appendToUI(todo, null);
  });
}

/**
 * types: primary, secondary, success, danger, warning, info, light, dark
 * message: String
 * @param {String} type
 * @param {String} message
 */
function showAlert(type, message) {
  if (!document.querySelector('.alert')) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    area.prepend(alert);
  }
}

function hideAlert() {
  const alert = document.querySelector('.alert');
  setTimeout(() => {
    alert ? area.removeChild(alert) : null
  }, 500);
}

function clearAllTodos() {
  list.innerHTML = '';
  localStorage.removeItem('todos');
}

function removeTodo(e) {
  if (e.target.dataset.action === 'delete') {
    e.target.parentElement.remove();
    removeTodoFromStorage(e.target.parentElement.firstChild.textContent);
    showAlert('info', 'Todo removed successfully');
  }
}

function removeTodoFromStorage(todo) {
  let todos = getTodosFromStorage();
  todos.forEach((item, index) => {
    (item === todo) ? todos.splice(index, 1) : null;
  });

  localStorage.setItem('todos', JSON.stringify(todos));
}

function filterTodos(e) {
  const value = e.target.value;
  const items = document.querySelectorAll('.list-group-item');

  items.forEach(item => {
    const text = item.textContent.toLowerCase();

    if(text.indexOf(value) === -1) {
      // Not found
      item.setAttribute('style', 'display:none!important');
    } else {
      item.setAttribute('style', '');
    }
  })
}
