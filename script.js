// Select elements
const welcomeScreen = document.getElementById('welcomeScreen');
const getStartedBtn = document.getElementById('getStartedBtn');
const app = document.getElementById('app');
const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskDateInput = document.getElementById('taskDate');
const taskTimeInput = document.getElementById('taskTime');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

const filterAllBtn = document.getElementById('filterAll');
const filterCompletedBtn = document.getElementById('filterCompleted');
const filterPendingBtn = document.getElementById('filterPending');

let tasks = []; // array to hold tasks
let filter = 'all'; // all, completed, pending

// Load tasks from localStorage
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (savedTasks) {
    tasks = savedTasks;
  }
  renderTasks();
};

// Show app and hide welcome screen on Get Started
getStartedBtn.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';
  app.style.display = 'flex';
});

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on filter
function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks;
  if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else {
    filteredTasks = tasks;
  }

  if (filteredTasks.length === 0) {
    const noTasks = document.createElement('li');
    noTasks.textContent = 'No tasks to show.';
    noTasks.style.textAlign = 'center';
    noTasks.style.color = '#7a8ba6';
    taskList.appendChild(noTasks);
    return;
  }

  filteredTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    if (task.completed) taskItem.classList.add('completed');
    taskItem.setAttribute('data-id', task.id);

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'checkbox';
    checkbox.setAttribute('aria-label', `Mark task "${task.title}" as completed`);
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    // Label for task title
    const label = document.createElement('label');
    label.textContent = task.title;
    label.htmlFor = task.id;

    // Meta: Date & Time
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    if (task.date && task.time) {
      meta.textContent = `${task.date} ${task.time}`;
    } else if (task.date) {
      meta.textContent = task.date;
    } else if (task.time) {
      meta.textContent = task.time;
    } else {
      meta.textContent = '';
    }

    // Actions: Edit & Delete
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.setAttribute('aria-label', `Edit task "${task.title}"`);
    editBtn.addEventListener('click', () => enableEdit(taskItem, task));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete task "${task.title}"`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    // Append children to taskItem
    taskItem.appendChild(checkbox);
    taskItem.appendChild(label);
    taskItem.appendChild(meta);
    taskItem.appendChild(actions);

    taskList.appendChild(taskItem);
  });
}

// Add new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  const date = taskDateInput.value;
  const time = taskTimeInput.value;

  if (!title) {
    alert('Please enter a task title.');
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    date,
    time,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskForm.reset();
  taskTitleInput.focus();
});

// Toggle completed status
function toggleComplete(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index > -1) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Enable editing task
function enableEdit(taskItem, task) {
  taskItem.innerHTML = '';

  // Title input
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = task.title;
  titleInput.className = 'task-edit-input';
  titleInput.setAttribute('aria-label', 'Edit task title');

  // Date input
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = task.date;
  dateInput.className = 'task-edit-input';
  dateInput.setAttribute('aria-label', 'Edit task date');

  // Time input
  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  timeInput.value = task.time;
  timeInput.className = 'task-edit-input';
  timeInput.setAttribute('aria-label', 'Edit task time');

  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'save-btn';
  saveBtn.setAttribute('aria-label', 'Save task changes');

  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'cancel-btn';
  cancelBtn.setAttribute('aria-label', 'Cancel task editing');

  saveBtn.addEventListener('click', () => {
    const updatedTitle = titleInput.value.trim();
    if (!updatedTitle) {
      alert('Task title cannot be empty.');
      return;
    }
    task.title = updatedTitle;
    task.date = dateInput.value;
    task.time = timeInput.value;
    saveTasks();
    renderTasks();
  });

  cancelBtn.addEventListener('click', () => {
    renderTasks();
  });

  // Append all inputs and buttons
  taskItem.appendChild(titleInput);
  taskItem.appendChild(dateInput);
  taskItem.appendChild(timeInput);
  taskItem.appendChild(saveBtn);
  taskItem.appendChild(cancelBtn);
}

// Clear all completed tasks
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Filter buttons functionality
function setFilter(newFilter) {
  filter = newFilter;

  // Remove active class from all
  filterAllBtn.classList.remove('active');
  filterCompletedBtn.classList.remove('active');
  filterPendingBtn.classList.remove('active');

  // Add active class to selected filter
  if (filter === 'all') filterAllBtn.classList.add('active');
  else if (filter === 'completed') filterCompletedBtn.classList.add('active');
  else if (filter === 'pending') filterPendingBtn.classList.add('active');

  renderTasks();
}

filterAllBtn.addEventListener('click', () => setFilter('all'));
filterCompletedBtn.addEventListener('click', () => setFilter('completed'));
filterPendingBtn.addEventListener('click', () => setFilter('pending'));
