// ============================================================
//  Todo Tracker — Frontend Logic (Todo.js)
//  Communicates with Spring Boot REST API at /todos
// ============================================================

const API_BASE = '/todos';

// ---- State ----
let allTodos   = [];   // Master list from server
let currentFilter = 'all';
let editingId  = null;
let deleteTargetId = null;

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  fetchAllTodos();

  // Add form submit
  document.getElementById('todoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddTodo();
  });

  // Edit form submit
  document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    handleEditSave();
  });

  // Close modals on overlay click
  document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDeleteModal();
  });

  // Confirm delete button
  document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (deleteTargetId !== null) handleDeleteTodo(deleteTargetId);
  });

  // Keyboard: Escape closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeDeleteModal(); }
  });
});

// ============================================================
//  API CALLS
// ============================================================

/** GET /todos — fetch all todos */
async function fetchAllTodos() {
  showLoading(true);
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    allTodos = await res.json();
    renderTodos();
    updateStats();
  } catch (err) {
    showToast('Failed to load tasks. Is the server running?', 'error');
    console.error(err);
  } finally {
    showLoading(false);
  }
}

/** POST /todos — create a new todo */
async function createTodo(title, description) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, completed: false })
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return await res.json();
}

/** PUT /todos/{id} — update title, description, or completed */
async function updateTodo(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return await res.json();
}

/** DELETE /todos/{id} — delete a todo */
async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
}

// ============================================================
//  HANDLERS
// ============================================================

async function handleAddTodo() {
  const titleInput = document.getElementById('todoTitle');
  const descInput  = document.getElementById('todoDescription');
  const btn        = document.getElementById('submitBtn');
  const btnText    = document.getElementById('submitBtnText');

  const title       = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title) {
    showToast('Please enter a task title.', 'error');
    titleInput.focus();
    return;
  }

  btn.disabled  = true;
  btnText.textContent = 'Adding...';

  try {
    const newTodo = await createTodo(title, description);
    allTodos.unshift(newTodo);  // Add to top of list
    renderTodos();
    updateStats();
    titleInput.value = '';
    descInput.value  = '';
    showToast('Task added successfully! 🎉', 'success');
  } catch (err) {
    showToast('Failed to add task. Try again.', 'error');
    console.error(err);
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Add Task';
    titleInput.focus();
  }
}

async function handleToggleComplete(id) {
  const todo = allTodos.find(t => t.id === id);
  if (!todo) return;

  const updated = { ...todo, completed: !todo.completed };

  // Optimistic UI update
  Object.assign(todo, updated);
  renderTodos();
  updateStats();

  try {
    const saved = await updateTodo(id, { title: todo.title, description: todo.description, completed: todo.completed });
    Object.assign(todo, saved);
    renderTodos();
    updateStats();
    showToast(todo.completed ? 'Task marked complete ✅' : 'Task marked pending', 'info');
  } catch (err) {
    // Revert on failure
    todo.completed = !todo.completed;
    renderTodos();
    updateStats();
    showToast('Failed to update task.', 'error');
  }
}

function openEditModal(id) {
  const todo = allTodos.find(t => t.id === id);
  if (!todo) return;

  document.getElementById('editId').value          = id;
  document.getElementById('editTitle').value        = todo.title;
  document.getElementById('editDescription').value  = todo.description || '';
  editingId = id;

  document.getElementById('editModal').style.display = 'flex';
  setTimeout(() => document.getElementById('editTitle').focus(), 100);
}

async function handleEditSave() {
  const id          = parseInt(document.getElementById('editId').value);
  const title       = document.getElementById('editTitle').value.trim();
  const description = document.getElementById('editDescription').value.trim();

  if (!title) {
    showToast('Title cannot be empty.', 'error');
    return;
  }

  try {
    const todo    = allTodos.find(t => t.id === id);
    const updated = await updateTodo(id, { title, description, completed: todo.completed });
    Object.assign(todo, updated);
    renderTodos();
    updateStats();
    closeModal();
    showToast('Task updated! ✏️', 'success');
  } catch (err) {
    showToast('Failed to update task.', 'error');
    console.error(err);
  }
}

function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById('deleteModal').style.display = 'flex';
}

async function handleDeleteTodo(id) {
  try {
    await deleteTodo(id);
    allTodos = allTodos.filter(t => t.id !== id);
    renderTodos();
    updateStats();
    closeDeleteModal();
    showToast('Task deleted.', 'info');
  } catch (err) {
    showToast('Failed to delete task.', 'error');
    console.error(err);
  }
}

// ============================================================
//  RENDER
// ============================================================

function renderTodos() {
  const list        = document.getElementById('todoList');
  const emptyState  = document.getElementById('emptyState');
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();

  let filtered = allTodos;

  // Apply filter
  if (currentFilter === 'pending')   filtered = filtered.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = filtered.filter(t => t.completed);

  // Apply search
  if (searchQuery) {
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(searchQuery) ||
      (t.description && t.description.toLowerCase().includes(searchQuery))
    );
  }

  list.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  filtered.forEach(todo => {
    const item = document.createElement('div');
    item.className = 'todo-item';
    item.setAttribute('data-id', todo.id);

    item.innerHTML = `
      <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"
           onclick="handleToggleComplete(${todo.id})"
           title="${todo.completed ? 'Mark as pending' : 'Mark as done'}">
        ${todo.completed ? '✓' : ''}
      </div>
      <div class="todo-content">
        <div class="todo-title ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.title)}</div>
        ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
      </div>
      <span class="todo-badge ${todo.completed ? 'badge-done' : 'badge-pending'}">
        ${todo.completed ? 'Done' : 'Pending'}
      </span>
      <div class="todo-actions">
        <button class="action-btn edit" onclick="openEditModal(${todo.id})" title="Edit task">✏️</button>
        <button class="action-btn delete" onclick="openDeleteModal(${todo.id})" title="Delete task">🗑️</button>
      </div>
    `;

    list.appendChild(item);
  });
}

// ============================================================
//  FILTER
// ============================================================
function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`filter${capitalize(filter)}`).classList.add('active');

  renderTodos();
}

// ============================================================
//  STATS
// ============================================================
function updateStats() {
  const total   = allTodos.length;
  const done    = allTodos.filter(t => t.completed).length;
  const pending = total - done;

  document.getElementById('totalCount').textContent   = total;
  document.getElementById('doneCount').textContent    = done;
  document.getElementById('pendingCount').textContent = pending;
}

// ============================================================
//  MODAL HELPERS
// ============================================================
function closeModal() {
  document.getElementById('editModal').style.display = 'none';
  editingId = null;
}

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTargetId = null;
}

// ============================================================
//  TOAST
// ============================================================
let toastTimer = null;

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = `toast ${type} show`;

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// ============================================================
//  LOADING
// ============================================================
function showLoading(show) {
  document.getElementById('loadingSpinner').style.display = show ? 'flex' : 'none';
  document.getElementById('todoList').style.display       = show ? 'none' : 'flex';
}

// ============================================================
//  UTILS
// ============================================================
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
