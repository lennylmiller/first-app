import { PolymerElement, html } from './node_modules/@polymer/polymer/polymer-element.js';
import './node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

class TodoApp extends PolymerElement {
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
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        h1 {
            font-size: 24px;
            color: #333;
            margin-top: 0;
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

      <h1>Polymer 3 Todos</h1>
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
      }
    };
  }

  static get observers() {
      return [
          '_saveTodos(todos.*)'
      ];
  }

  ready() {
      super.ready();
      const storedTodos = localStorage.getItem('polymer3-todo-list');
      if (storedTodos) {
          this.todos = JSON.parse(storedTodos);
      }
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
      localStorage.setItem('polymer3-todo-list', JSON.stringify(this.todos));
  }
}

customElements.define('todo-app', TodoApp);
