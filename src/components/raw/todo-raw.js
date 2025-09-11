// Raw Web Component - Vanilla JavaScript
import './settings-modal.js';

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
  </style>
  <h1>Raw Web Component Todo</h1>
  <button class="settings-btn" id="settings-btn" aria-label="Settings">⋯</button>
  
  <div class="input-container">
    <input type="text" id="new-item-input" placeholder="Add a new task...">
    <button id="add-btn">Ad</button>
  </div>
  <ul id="todo-list"></ul>
  
  <!-- Settings Modal Component -->
  <settings-modal-raw id="settings-modal"></settings-modal-raw>
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
    const settingsModal = this.shadowRoot.querySelector('#settings-modal');
    this.shadowRoot.querySelector('#settings-btn').addEventListener('click', () => {
      settingsModal.show();
    });
    
    // Listen for clear storage event from settings modal
    settingsModal.addEventListener('clear-storage', () => {
      this._clearStorage();
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
      // Hide the modal after clearing
      const settingsModal = this.shadowRoot.querySelector('#settings-modal');
      settingsModal.hide();
    }
  }
}

customElements.define('todo-list-raw', TodoListRaw);