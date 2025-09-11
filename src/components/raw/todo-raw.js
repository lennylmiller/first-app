// Raw Web Component - Vanilla JavaScript
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      max-width: 400px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 20px;
      margin: 20px;
      position: relative;
    }
    h1 {
      font-size: 24px;
      color: #333;
      margin-top: 0;
      padding-right: 40px;
    }
    .settings-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 18px;
      color: #666;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .settings-btn:hover {
      background-color: #f0f0f0;
      border-color: #999;
    }
    .input-container {
      display: flex;
      margin-bottom: 20px;
    }
    #new-item-input {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
      font-size: 16px;
    }
    #add-btn {
      padding: 10px 15px;
      border: none;
      background-color: #007aff;
      color: white;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      font-size: 16px;
    }
    #add-btn:hover {
      background-color: #005ecb;
    }
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      font-size: 16px;
    }
    li:last-child {
      border-bottom: none;
    }
    .delete-btn {
      background: none;
      border: none;
      color: #ff3b30;
      cursor: pointer;
      font-size: 18px;
    }
    /* Modal Styles */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-overlay.show {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      animation: slideUp 0.3s ease-out;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .modal-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
    }
    .modal-close:hover {
      color: #333;
    }
    .settings-option {
      margin: 15px 0;
    }
    .clear-storage-btn {
      width: 100%;
      padding: 10px;
      background-color: #ff3b30;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }
    .clear-storage-btn:hover {
      background-color: #dc2626;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { 
        transform: translateY(20px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }
  </style>
  <h1>Raw Web Component Todo</h1>
  <button class="settings-btn" id="settings-btn" aria-label="Settings">⋯</button>
  
  <div class="input-container">
    <input type="text" id="new-item-input" placeholder="Add a new task...">
    <button id="add-btn">Ad</button>
  </div>
  <ul id="todo-list"></ul>
  
  <!-- Settings Modal -->
  <div class="modal-overlay" id="settings-modal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-title">Settings</span>
        <button class="modal-close" id="modal-close" aria-label="Close">×</button>
      </div>
      <div class="settings-option">
        <button class="clear-storage-btn" id="clear-storage-btn">🗑️ Clear All Todos</button>
      </div>
    </div>
  </div>
`;

export class TodoListRaw extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.todos = [];
    this.listId = 'raw-todo-list';
  }
  
  connectedCallback() {
    this._loadList();
    this._renderList();
    
    // Basic todo functionality
    this.shadowRoot.querySelector('#add-btn').addEventListener('click', () => this._addItem());
    this.shadowRoot.querySelector('#new-item-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._addItem();
      }
    });
    this.shadowRoot.querySelector('#todo-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index, 10);
        this._deleteItem(index);
      }
    });
    
    // Settings modal functionality
    const modal = this.shadowRoot.querySelector('#settings-modal');
    this.shadowRoot.querySelector('#settings-btn').addEventListener('click', () => this._showModal());
    this.shadowRoot.querySelector('#modal-close').addEventListener('click', () => this._hideModal());
    this.shadowRoot.querySelector('#clear-storage-btn').addEventListener('click', () => this._clearStorage());
    
    // Click outside modal to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this._hideModal();
      }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        this._hideModal();
      }
    });
  }
  
  _loadList() {
    const storedTodos = localStorage.getItem(this.listId);
    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
    }
  }
  
  _saveList() {
    localStorage.setItem(this.listId, JSON.stringify(this.todos));
  }
  
  _renderList() {
    const listElement = this.shadowRoot.querySelector('#todo-list');
    listElement.innerHTML = '';
    this.todos.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item}</span>
        <button class="delete-btn" data-index="${index}">×</button>
      `;
      listElement.appendChild(li);
    });
  }
  
  _addItem() {
    const input = this.shadowRoot.querySelector('#new-item-input');
    const newItem = input.value.trim();
    if (newItem) {
      this.todos.push(newItem);
      this._saveList();
      this._renderList();
      input.value = '';
      input.focus();
    }
  }
  
  _deleteItem(index) {
    this.todos.splice(index, 1);
    this._saveList();
    this._renderList();
  }
  
  _clearStorage() {
    if (confirm('Are you sure you want to clear all todos?')) {
      this.todos = [];
      localStorage.removeItem(this.listId);
      this._renderList();
      this._hideModal();
    }
  }
  
  _showModal() {
    const modal = this.shadowRoot.querySelector('#settings-modal');
    modal.classList.add('show');
  }
  
  _hideModal() {
    const modal = this.shadowRoot.querySelector('#settings-modal');
    modal.classList.remove('show');
  }
}

customElements.define('todo-list-raw', TodoListRaw);