// Lit 3 Web Component
import { LitElement, html, css } from 'lit';

export class TodoLit extends LitElement {
  static styles = css`
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
    input {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
      font-size: 16px;
    }
    button {
      padding: 10px 15px;
      border: none;
      background-color: #324fff;
      color: white;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #1e3aff;
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
  `;

  static properties = {
    todos: { state: true },
    showModal: { state: true }
  };

  constructor() {
    super();
    this.storageKey = 'lit-todo-list';
    this.todos = this._loadList();
    this.showModal = false;
  }

  _loadList() {
    const storedTodos = localStorage.getItem(this.storageKey);
    return storedTodos ? JSON.parse(storedTodos) : [];
  }

  _saveList() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  _handleKeydown(e) {
    if (e.key === 'Enter') {
      this._addItem();
    }
  }

  _addItem() {
    const input = this.shadowRoot.querySelector('#new-item-input');
    const newItem = input.value.trim();
    if (newItem) {
      this.todos = [...this.todos, newItem];
      this._saveList();
      input.value = '';
    }
  }

  _deleteItem(index) {
    this.todos = this.todos.filter((_, i) => i !== index);
    this._saveList();
  }

  _clearStorage() {
    if (confirm('Are you sure you want to clear all todos?')) {
      this.todos = [];
      localStorage.removeItem(this.storageKey);
      this.showModal = false;
    }
  }
  
  _showSettings() {
    this.showModal = true;
  }
  
  _hideModal() {
    this.showModal = false;
  }
  
  _handleModalClick(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this.showModal = false;
    }
  }

  render() {
    return html`
      <h1>Lit Todo</h1>
      <button class="settings-btn" @click=${this._showSettings} aria-label="Settings">⋯</button>
      
      <div class="input-container">
        <input 
          type="text" 
          id="new-item-input" 
          placeholder="Add a new task..." 
          @keydown=${this._handleKeydown}>
        <button @click=${this._addItem}>Add</button>
      </div>
      <ul>
        ${this.todos.map((item, index) => html`
          <li>
            <span>${item}</span>
            <button class="delete-btn" @click=${() => this._deleteItem(index)}>×</button>
          </li>
        `)}
      </ul>
      
      <!-- Settings Modal -->
      <div class="modal-overlay ${this.showModal ? 'show' : ''}" @click=${this._handleModalClick}>
        <div class="modal-content">
          <div class="modal-header">
            <span class="modal-title">Settings</span>
            <button class="modal-close" @click=${this._hideModal} aria-label="Close">×</button>
          </div>
          <div class="settings-option">
            <button class="clear-storage-btn" @click=${this._clearStorage}>🗑️ Clear All Todos</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('todo-lit', TodoLit);