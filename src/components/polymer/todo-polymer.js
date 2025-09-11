// Polymer 3 Web Component
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

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
        .modal-overlay[show] {
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
      
      <!-- Settings Modal -->
      <div class="modal-overlay" show$="[[showModal]]" on-click="_handleModalClick">
        <div class="modal-content">
          <div class="modal-header">
            <span class="modal-title">Settings</span>
            <button class="modal-close" on-click="_hideModal" aria-label="Close">×</button>
          </div>
          <div class="settings-option">
            <button class="clear-storage-btn" on-click="_clearStorage">🗑️ Clear All Todos</button>
          </div>
        </div>
      </div>
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
      showModal: {
        type: Boolean,
        value: false
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
      this._hideModal();
    }
  }
  
  _showModal() {
    this.showModal = true;
  }
  
  _hideModal() {
    this.showModal = false;
  }
  
  _handleModalClick(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this._hideModal();
    }
  }
}

customElements.define('todo-polymer', TodoPolymer);