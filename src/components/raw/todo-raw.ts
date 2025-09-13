// Raw Web Component - Vanilla JavaScript with TypeScript
import './settings-modal.ts';

const template: HTMLTemplateElement = document.createElement('template');
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
    <button id="add-btn">Add</button>
  </div>
  <ul id="todo-list"></ul>

  <!-- Settings Modal Component -->
  <settings-modal-raw id="settings-modal"></settings-modal-raw>
`;

interface SettingsModal extends HTMLElement {
  show(): void;
  hide(): void;
}

export class TodoListRaw extends HTMLElement {
  private todos: string[];
  private listId: string;
  declare shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.todos = [];
    this.listId = 'raw-todo-list';
  }

  connectedCallback(): void {
    this._loadList();
    this._renderList();

    // Basic todo functionality
    const addBtn = this.shadowRoot.querySelector('#add-btn') as HTMLButtonElement;
    addBtn.addEventListener('click', () => this._addItem());

    const newItemInput = this.shadowRoot.querySelector('#new-item-input') as HTMLInputElement;
    newItemInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this._addItem();
      }
    });

    const todoList = this.shadowRoot.querySelector('#todo-list') as HTMLUListElement;
    todoList.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('delete-btn')) {
        const index = parseInt(target.dataset.index!, 10);
        this._deleteItem(index);
      }
    });

    // Settings modal functionality
    const settingsModal = this.shadowRoot.querySelector('#settings-modal') as SettingsModal;
    const settingsBtn = this.shadowRoot.querySelector('#settings-btn') as HTMLButtonElement;
    settingsBtn.addEventListener('click', () => {
      settingsModal.show();
    });

    // Listen for clear storage event from settings modal
    settingsModal.addEventListener('clear-storage', () => {
      this._clearStorage();
    });
  }

  private _loadList(): void {
    const storedTodos: string | null = localStorage.getItem(this.listId);
    if (storedTodos) {
      try {
        const parsed = JSON.parse(storedTodos);
        if (Array.isArray(parsed)) {
          this.todos = [...parsed] as string[];
        }
      } catch (error) {
        console.error('Error parsing stored todos:', error);
        this.todos = [];
      }
    }
  }

  private _saveList(): void {
    localStorage.setItem(this.listId, JSON.stringify(this.todos));
  }

  private _renderList(): void {
    const listElement = this.shadowRoot.querySelector('#todo-list') as HTMLUListElement;
    listElement.innerHTML = '';
    this.todos.forEach((item: string, index: number) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${this._escapeHtml(item)}</span>
        <button class="delete-btn" data-index="${index}">×</button>
      `;
      listElement.appendChild(li);
    });
  }

  private _escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private _addItem(): void {
    const input = this.shadowRoot.querySelector('#new-item-input') as HTMLInputElement;
    const newItem: string = input.value.trim();
    if (newItem) {
      this.todos.push(newItem);
      this._saveList();
      this._renderList();
      input.value = '';
      input.focus();
    }
  }

  private _deleteItem(index: number): void {
    if (index >= 0 && index < this.todos.length) {
      this.todos.splice(index, 1);
      this._saveList();
      this._renderList();
    }
  }

  private _clearStorage(): void {
    if (confirm('Are you sure you want to clear all todos?')) {
      this.todos = [];
      localStorage.removeItem(this.listId);
      this._renderList();
      // Hide the modal after clearing
      const settingsModal = this.shadowRoot.querySelector('#settings-modal') as SettingsModal;
      settingsModal.hide();
    }
  }
}

customElements.define('todo-list-raw', TodoListRaw);