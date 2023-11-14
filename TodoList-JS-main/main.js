const form = document.forms['form'];
const input = form['input'];
const addlist = form['addBtn'];
const todoList = document.querySelector('.list');
const clearAll = document.getElementsByClassName('clear-all')[0];
let editElem;
let editFlag;
let editId;
//Event Listeners
form.addEventListener('submit', addListItem);
clearAll.addEventListener('click', clearAllList)
document.addEventListener('DOMContentLoaded', initList);

//Functions

//function for init list
function initList() {
  const taskArr = getLocalStorage()
  taskArr.forEach(item => {
    createItem(item.id, item.listValue, item.createdTime)
  });
};

//function for default settings
function defaultSettings() {
  input.value = "";
  editFlag = false;
  addlist.textContent = 'Add new task';
}

//function to show alert
function displayAlert(alert) {
  p = document.createElement('p');
  p.textContent = alert;
  p.classList.add('alertStyle');
  const div = document.querySelector('.container');
  div.prepend(p);
  setTimeout(() => {
    div.removeChild(p);
  }, 1000)
}

//function to show error
function showError(error) {
  const errorWrap = document.createElement('span');
  errorWrap.classList.add('error');
  errorWrap.textContent = error;
  const container = document.querySelector('.container');
  container.prepend(errorWrap);
  setTimeout(() => {
    container.removeChild(errorWrap);
  }, 2000);
}

//Add function
function addListItem(e) {
  e.preventDefault();
  const listValue = input.value.trim();
  const createdTime = currentTime();
  const id = new Date().getTime().toString();
  if (listValue && !editFlag) {
    createItem(id, listValue, createdTime)
    displayAlert("Item has been added to the list!");
    defaultSettings()
    const currentTaskItem = {
      id: id,
      listValue: listValue,
      createdTime: createdTime
    }
    const taskArr = getLocalStorage()
    taskArr.push(currentTaskItem);
    localStorage.setItem('todolist', JSON.stringify(taskArr));
  } else if (listValue && editFlag) {
    editElem.textContent = listValue;
    displayAlert("Item has been edited in the list!");
    const currentId = editElem.parentElement.parentElement.getAttribute('dataId')
    editLocalStorage(currentId, listValue);
    defaultSettings();
  } else if (!listValue) {
    showError("Please enter task for todolist!");
  }
}

//function to get values from localStorage
function getLocalStorage() {
  return localStorage.getItem('todolist')
    ? JSON.parse(localStorage.getItem('todolist'))
    : [];

}

//function for getting current time
function currentTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}

//function to create Item
function createItem(id, listValue, createdTime) {
  const listItem = document.createElement('li');
  listItem.setAttribute('dataId', id);
  listItem.classList.add('list-item');
  listItem.innerHTML = `
    <span>
     <span class="todoName">${listValue}</span>
     - ${createdTime}</span>
          <div class="btn-container">
            <button class="edit-btn">
              Edit
            </button>
            <label class="label">
                        <input type="checkbox" class="done-element">
                        <i class="checkmark"></i>
                    </label>
            <i class="delete-icon">
            </i>
          </div>
  `;
  todoList.append(listItem)
  const deleteItem = listItem.querySelector('.delete-icon');
  deleteItem.addEventListener('click', removeElement);
  const editItem = listItem.querySelector('.edit-btn');
  editItem.addEventListener('click', editElement);
  const doneElement = listItem.querySelector('.done-element');
  doneElement.addEventListener('change', chooseDoneElements);
  doneElement.type = 'checkbox';
}

//function to delete Item
function removeElement(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const items = getLocalStorage();
  const updatedList = items.filter(item => item.id !== element.getAttribute('dataId'));
  localStorage.setItem('todolist', JSON.stringify(updatedList));
  element.remove();
  displayAlert("Item has been removed from the list!");
}

//function to edit element
function editElement(e, id) {
  const element = document.querySelector('.todoName');
  editElem = element;
  input.value = editElem.textContent;
  addlist.textContent = 'Edit';
  editFlag = true;
  editId = element.dataset.id;
}

//function editLocalstorage
function editLocalStorage(id, listValue) {
  console.log(id, listValue)
  const liElem = editElem.parentElement.parentElement.dataset.id;
  console.log(liElem)
  const elements = getLocalStorage();
  console.log(elements)
  const updatedList = elements.map(item => {
    if (id === item.id) {
      item.listValue = editElem.textContent;
    }
    return item
  })
  localStorage.setItem('todolist', JSON.stringify(updatedList));
}

//function for done Elements
function chooseDoneElements(e) {
  const checkbox = e.target;
  const elemContent = e.target.parentElement.parentElement.previousElementSibling;
  if (checkbox.checked) {
    elemContent.style.textDecoration = 'line-through';
    displayAlert("Item has been done!");
  } else {
    elemContent.style.textDecoration = 'none';
    displayAlert("Item hasn't been done yet!");
  }
};

//function to clear all items
function clearAllList(e) {
  const elements = document.querySelectorAll('.list-item');
  const items = getLocalStorage()
  console.log(elements);
  elements.forEach(item => {
    item.remove();
  })
  let updatedList = items.map(item => {
    localStorage.removeItem(item);
  })
  displayAlert("All list has been cleared!");
  updatedList = [];
  localStorage.setItem('todolist', updatedList);
};







