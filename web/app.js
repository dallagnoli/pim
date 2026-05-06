const API = "http://localhost:3000";

let current = "notes";
let editingId = null;

// --------------------
// SWITCH RESOURCE
// --------------------
function setResource(res) {
  current = res;
  document.getElementById("title").innerText = res;

  // update active button
  document.querySelectorAll('.sidebar button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // update main content class
  document.getElementById('main-content').className = `main ${res}`;

  loadItems();
}

function openCreateModal() {
  const heading = document.getElementById('create-modal-heading');
  const titleInput = document.getElementById('create-title');
  const contentInput = document.getElementById('create-content');

  titleInput.value = '';
  contentInput.value = '';
  titleInput.style.display = 'block';
  contentInput.style.display = 'block';

  if (current === 'notes') {
    heading.innerText = 'Create Note';
    titleInput.placeholder = 'Title';
    contentInput.placeholder = 'Content';
  } else if (current === 'ideas') {
    heading.innerText = 'Create Idea';
    titleInput.style.display = 'none';
    contentInput.placeholder = 'Content';
  } else if (current === 'links') {
    heading.innerText = 'Create Link';
    titleInput.placeholder = 'Title';
    contentInput.placeholder = 'URL';
  } else if (current === 'tasks') {
    heading.innerText = 'Create Task';
    contentInput.style.display = 'none';
    titleInput.placeholder = 'Title';
  }

  document.getElementById('create-modal').classList.remove('hidden');
}

function closeCreateModal() {
  document.getElementById('create-modal').classList.add('hidden');
}

async function submitCreate() {
  const title = document.getElementById('create-title').value.trim();
  const content = document.getElementById('create-content').value.trim();
  let body = {};

  if (current === 'notes') {
    if (!title || !content) {
      alert('Title and content are required');
      return;
    }
    body = { title, content };
  } else if (current === 'ideas') {
    if (!content) {
      alert('Content is required');
      return;
    }
    body = { content };
  } else if (current === 'links') {
    if (!title || !content) {
      alert('Title and URL are required');
      return;
    }
    body = { title, url: content };
  } else if (current === 'tasks') {
    if (!title) {
      alert('Title is required');
      return;
    }
    body = { title };
  }

  const response = await fetch(`${API}/${current}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Error: ${error.error}`);
    return;
  }

  closeCreateModal();
  loadItems();
}


// --------------------
// LOAD
// --------------------
async function loadItems() {
  const res = await fetch(`${API}/${current}`);
  const json = await res.json();

  render(json.data || json);
}

// --------------------
// RENDER
// --------------------
function render(items) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    if (current === "notes") {
      const hasUpdated = item.updated_at && item.updated_at !== item.created_at;
      div.dataset.noteId = item.id;
      div.innerHTML = `
        <div class="notes-header">
          <h3>${item.title}</h3>
          <button class="delete-btn" onclick="removeItem(${item.id})">×</button>
        </div>
        <p>${item.content || ''}</p>
        <div class="notes-footer">
          <div class="meta">
            Created: ${new Date(item.created_at).toLocaleString()}
            ${hasUpdated ? `<br>Updated: ${new Date(item.updated_at).toLocaleString()}` : ''}
          </div>
          <button class="edit-btn" onclick="startEdit(${item.id})">Edit</button>
        </div>
      `;
    } else if (current === "ideas") {
      div.innerHTML = `
        <div class="card-content">
          <p>${item.content}</p>
        </div>
        <div class="ideas-footer">
          <div class="meta">Created: ${new Date(item.created_at).toLocaleString()}</div>
          <button class="delete-btn" onclick="removeItem(${item.id})">×</button>
        </div>
      `;
    } else if (current === "links") {
      div.innerHTML = `
        <div class="links-header">
          <div class="links-info">
            <h3>${item.title}</h3>
            <a href="${item.url}" target="_blank">${item.url}</a>
          </div>
          <button class="delete-btn" onclick="removeItem(${item.id})">×</button>
        </div>
        <div class="meta">Created: ${new Date(item.created_at).toLocaleString()}</div>
      `;
    } else if (current === "tasks") {
      div.className = `card ${item.done ? 'done' : ''}`;
      div.innerHTML = `
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleTask(${item.id}, this.checked)" />
        <div class="task-body">
          <div class="task-title">${item.title}</div>
          <div class="task-footer">
            <div class="meta">Created: ${new Date(item.created_at).toLocaleString()}</div>
            <button class="delete-btn" onclick="removeItem(${item.id})">×</button>
          </div>
        </div>
      `;
    }

    list.appendChild(div);
  });
}

// --------------------
// TOGGLE TASK
// --------------------
async function toggleTask(id, done) {
  const response = await fetch(`${API}/tasks/${id}/toggle`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done })
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Error: ${error.error}`);
    return;
  }

  loadItems();
}

// --------------------
// EDIT NOTE
// --------------------
function startEdit(id) {
  editingId = id;
  const card = document.querySelector(`.notes .card[data-note-id='${id}']`);
  const title = card ? card.querySelector('h3').textContent : '';
  const content = card ? card.querySelector('p').textContent : '';

  document.getElementById('edit-title').value = title;
  document.getElementById('edit-content').value = content;
  document.getElementById('edit-modal').classList.remove('hidden');
}

function cancelEdit() {
  editingId = null;
  document.getElementById('edit-modal').classList.add('hidden');
}

async function saveEdit() {
  const title = document.getElementById('edit-title').value.trim();
  const content = document.getElementById('edit-content').value.trim();

  if (!title || !content) {
    alert('Title and content are required');
    return;
  }

  const response = await fetch(`${API}/notes/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Error: ${error.error}`);
    return;
  }

  editingId = null;
  document.getElementById('edit-modal').classList.add('hidden');
  loadItems();
}

// --------------------
// DELETE
// --------------------
async function removeItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  const response = await fetch(`${API}/${current}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Error: ${error.error}`);
    return;
  }

  loadItems();
}

// --------------------
// INIT
// --------------------
loadItems();