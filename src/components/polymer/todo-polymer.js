// Polymer 3 Web Component
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import './settings-modal.js';

export class TodoPolymer extends PolymerElement {
  static get template() {
    return html`
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
          background-color: #3f51b5;
          color: white;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #303f9f;
        }
        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
          font-size: 16px;
        }
        .todo-item:last-of-type {
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

      <h1>Polymer 3 Todo</h1>
      <button class="settings-btn" on-click="_showModal" aria-label="Settings">⋯</button>
      
      <div class="input-container">
        <input value="{{newItem::input}}" placeholder="Add a new task..." on-keydown="_handleKeydown">
        <button on-click="_addItem">Add</button>
      </div>

      <template is="dom-repeat" items="{{todos}}">
        <div class="todo-item">
          <span>{{item}}</span>
          <button class="delete-btn" on-click="_deleteItem">×</button>
        </div>
      </template>
      
      <!-- Settings Modal Component -->
      <settings-modal-polymer id="settingsModal" on-clear-storage="_clearStorage"></settings-modal-polymer>
    `;
  }

  static get properties() {
    return {
      newItem: {
        type: String,
        value: ''
      },
      todos: {
        type: Array,
        value: () => []
},
      _initialized: {
        type: Boolean,
        value: false
      }
    };
  }

  static get observers() {
    return [
      '_saveTodos(todos.*)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    const storedTodos = localStorage.getItem('polymer-todo-list');
    if (storedTodos) {
      this.set('todos', JSON.parse(storedTodos));
    }
    this._initialized = true;
  }

  _handleKeydown(e) {
    if (e.key === 'Enter') {
      this._addItem();
    }
  }

  _addItem() {
    if (this.newItem && this.newItem.trim()) {
      this.push('todos', this.newItem.trim());
      this.newItem = '';
    }
  }

  _deleteItem(e) {
    const itemToDelete = e.model.item;
    const index = this.todos.indexOf(itemToDelete);
    if (index > -1) {
      this.splice('todos', index, 1);
    }
  }

  _saveTodos() {
    if (this._initialized) {
      localStorage.setItem('polymer-todo-list', JSON.stringify(this.todos));
    }
  }
  
  _clearStorage() {
    if (confirm('Are you sure you want to clear all todos?')) {
      this.set('todos', []);
      localStorage.removeItem('polymer-todo-list');
      // Hide the modal after clearing
      this.shadowRoot.querySelector('#settingsModal').hide();
    }
  }
  
  _showModal() {
    this.shadowRoot.querySelector('#settingsModal').show();
  }
}

customElements.define('todo-polymer', TodoPolymer);