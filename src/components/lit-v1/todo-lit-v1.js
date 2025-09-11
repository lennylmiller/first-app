// Lit v1 (lit-element 2.x and lit-html 1.x) Todo Component
import { LitElement, html, css } from 'lit-element';
import './settings-modal.js';

export class TodoLitV1 extends LitElement {
  static get properties() {
    return {
      todos: { type: Array },
      newItem: { type: String }
    };
  }

  static get styles() {
    return css`
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
      
      :host::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
        border-radius: 8px 8px 0 0;
      }
      
      h1 {
        font-size: 24px;
        color: #333;
        margin-top: 10px;
        margin-bottom: 20px;
        padding-right: 40px;
      }
      
      .badge {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        margin-left: 10px;
        font-weight: normal;
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        font-size: 16px;
      }
      
      button:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b4495 100%);
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
        padding: 0;
        width: 24px;
        height: 24px;
      }
      
      .delete-btn:hover {
        color: #ff1414;
      }
      
      .empty-state {
        text-align: center;
        color: #999;
        padding: 20px;
        font-style: italic;
      }
    `;
  }

  constructor() {
    super();
    this.storageKey = 'lit-v1-todo-list';
    this.todos = [];
    this.newItem = '';
  }

  connectedCallback() {
    super.connectedCallback();
    // Load todos when component is connected to DOM
    this.todos = this._loadList();
  }

  _loadList() {
    const storedTodos = localStorage.getItem(this.storageKey);
    return storedTodos ? JSON.parse(storedTodos) : [];
  }

  _saveList() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  _handleInput(e) {
    this.newItem = e.target.value;
  }

  _handleKeydown(e) {
    if (e.key === 'Enter') {
      this._addItem();
    }
  }

  _addItem() {
    const trimmedItem = this.newItem.trim();
    if (trimmedItem) {
      this.todos = [...this.todos, trimmedItem];
      this._saveList();
      this.newItem = '';
      // Clear the input field
      this.shadowRoot.querySelector('#new-item-input').value = '';
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
      // Hide the modal after clearing
      this.shadowRoot.querySelector('#settingsModal').hide();
    }
  }
  
  _showSettings() {
    this.shadowRoot.querySelector('#settingsModal').show();
  }

  render() {
    return html`
      <h1>
        Lit v1 Todo
        <span class="badge">lit-element 2.x</span>
      </h1>
      <button class="settings-btn" @click=${this._showSettings} aria-label="Settings">⋯</button>
      
      <div class="input-container">
        <input 
          type="text" 
          id="new-item-input"
          placeholder="Add a new task..." 
          .value=${this.newItem}
          @input=${this._handleInput}
          @keydown=${this._handleKeydown}
        >
        <button @click=${this._addItem}>Add</button>
      </div>
      
      ${this.todos.length === 0 
        ? html`<div class="empty-state">No tasks yet. Add one above!</div>`
        : html`
            <ul>
              ${this.todos.map((item, index) => html`
                <li>
                  <span>${item}</span>
                  <button 
                    class="delete-btn" 
                    @click=${() => this._deleteItem(index)}
                    aria-label="Delete task"
                  >×</button>
                </li>
              `)}
            </ul>
          `
      }
      
      <!-- Settings Modal Component -->
      <settings-modal-lit-v1 id="settingsModal" @clear-storage=${this._clearStorage}></settings-modal-lit-v1>
    `;
  }
}

customElements.define('todo-lit-v1', TodoLitV1);