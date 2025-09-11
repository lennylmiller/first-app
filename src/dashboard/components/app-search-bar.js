import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';
import { storage } from '../services/storage-service.js';

export class AppSearchBar extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: relative;
      }
      
      .search-container {
        position: relative;
        width: 100%;
        max-width: 400px;
      }
      
      .search-input-wrapper {
        position: relative;
      }
      
      .search-input {
        width: 100%;
        padding: 0.5rem 1rem;
        padding-left: 2.5rem;
        padding-right: 3rem;
        border: 1px solid var(--input-border);
        border-radius: 20px;
        background-color: var(--color-surface);
        color: var(--color-text-primary);
        font-size: 0.875rem;
        transition: all var(--transition-fast);
      }
      
      .search-input:focus {
        outline: none;
        border-color: var(--input-focus);
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
        background-color: var(--color-background);
      }
      
      .search-input::placeholder {
        color: var(--color-text-secondary);
      }
      
      .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-secondary);
        pointer-events: none;
      }
      
      .search-shortcut {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        padding: 0.125rem 0.375rem;
        background-color: var(--color-surface-variant);
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        font-family: monospace;
        pointer-events: none;
        transition: opacity var(--transition-fast);
      }
      
      .search-input:focus ~ .search-shortcut {
        opacity: 0;
      }
      
      .search-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        right: 0;
        background-color: var(--color-surface);
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        animation: slideDown var(--transition-fast);
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .search-section {
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--sidebar-border);
      }
      
      .search-section:last-child {
        border-bottom: none;
      }
      
      .search-section-title {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
      }
      
      .search-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 1rem;
        color: var(--color-text-primary);
        text-decoration: none;
        cursor: pointer;
        transition: background-color var(--transition-fast);
      }
      
      .search-item:hover,
      .search-item.selected {
        background-color: var(--sidebar-hover);
      }
      
      .search-item-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
      }
      
      .search-item-content {
        flex: 1;
      }
      
      .search-item-title {
        font-size: 0.875rem;
        margin-bottom: 0.125rem;
      }
      
      .search-item-description {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
      }
      
      .search-item-action {
        padding: 0.25rem 0.5rem;
        background-color: var(--color-primary);
        color: white;
        border-radius: var(--border-radius);
        font-size: 0.75rem;
      }
      
      .search-empty {
        padding: 2rem;
        text-align: center;
        color: var(--color-text-secondary);
      }
      
      .search-clear {
        position: absolute;
        right: 2.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        display: none;
        transition: color var(--transition-fast);
      }
      
      .search-clear:hover {
        color: var(--color-text-primary);
      }
      
      .search-clear.visible {
        display: block;
      }
    `
  ];
  
  static properties = {
    searchTerm: { type: String, state: true },
    isOpen: { type: Boolean, state: true },
    results: { type: Array, state: true },
    selectedIndex: { type: Number, state: true },
    searchHistory: { type: Array, state: true }
  };
  
  constructor() {
    super();
    this.searchTerm = '';
    this.isOpen = false;
    this.results = [];
    this.selectedIndex = -1;
    this.searchHistory = storage.get('searchHistory', []);
    this.debounceTimeout = null;
    
    // Quick actions
    this.quickActions = [
      { id: 'new-todo', title: 'New Todo', icon: '➕', action: 'create-todo' },
      { id: 'theme', title: 'Toggle Theme', icon: '🎨', action: 'toggle-theme' },
      { id: 'settings', title: 'Settings', icon: '⚙️', path: '/settings' },
      { id: 'profile', title: 'Profile', icon: '👤', path: '/profile' }
    ];
    
    // Searchable items
    this.searchableItems = [
      { title: 'Todos', description: 'Manage your tasks', icon: '✓', path: '/todos' },
      { title: 'Analytics', description: 'View statistics', icon: '📊', path: '/analytics' },
      { title: 'Widgets', description: 'Dashboard widgets', icon: '📋', path: '/widgets' },
      { title: 'Profile', description: 'User profile', icon: '👤', path: '/profile' },
      { title: 'Settings', description: 'App settings', icon: '⚙️', path: '/settings' },
      { title: 'Light Theme', description: 'Switch to light theme', icon: '☀️', action: 'theme-light' },
      { title: 'Dark Theme', description: 'Switch to dark theme', icon: '🌙', action: 'theme-dark' }
    ];
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.setupKeyboardShortcuts();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeKeyboardShortcuts();
  }
  
  setupKeyboardShortcuts() {
    this.keydownHandler = (e) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.focusSearch();
      }
      
      // Escape to close search
      if (e.key === 'Escape' && this.isOpen) {
        this.closeSearch();
      }
      
      // Arrow keys for navigation
      if (this.isOpen && this.results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectNext();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectPrevious();
        } else if (e.key === 'Enter' && this.selectedIndex >= 0) {
          e.preventDefault();
          this.executeResult(this.results[this.selectedIndex]);
        }
      }
    };
    
    document.addEventListener('keydown', this.keydownHandler);
  }
  
  removeKeyboardShortcuts() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }
  
  render() {
    const showClear = this.searchTerm.length > 0;
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcut = isMac ? '⌘K' : 'Ctrl+K';
    
    return html`
      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="search"
            class="search-input"
            placeholder="Search..."
            .value="${this.searchTerm}"
            @input="${this.handleInput}"
            @focus="${this.handleFocus}"
            @blur="${this.handleBlur}"
            @keydown="${this.handleKeydown}">
          ${showClear ? html`
            <button 
              class="search-clear visible"
              @click="${this.clearSearch}"
              aria-label="Clear search">
              ✕
            </button>
          ` : ''}
          ${!this.isOpen && !showClear ? html`
            <span class="search-shortcut">${shortcut}</span>
          ` : ''}
        </div>
        
        ${this.isOpen ? html`
          <div class="search-dropdown" @mousedown="${(e) => e.preventDefault()}">
            ${this.renderSearchContent()}
          </div>
        ` : ''}
      </div>
    `;
  }
  
  renderSearchContent() {
    if (this.searchTerm.length === 0) {
      return this.renderQuickActions();
    }
    
    if (this.results.length === 0) {
      return html`
        <div class="search-empty">
          <p>No results found for "${this.searchTerm}"</p>
        </div>
      `;
    }
    
    return html`
      <div class="search-section">
        <div class="search-section-title">Search Results</div>
        ${this.results.map((result, index) => html`
          <div 
            class="search-item ${index === this.selectedIndex ? 'selected' : ''}"
            @click="${() => this.executeResult(result)}"
            @mouseenter="${() => this.selectedIndex = index}">
            <span class="search-item-icon">${result.icon}</span>
            <div class="search-item-content">
              <div class="search-item-title">${result.title}</div>
              ${result.description ? html`
                <div class="search-item-description">${result.description}</div>
              ` : ''}
            </div>
          </div>
        `)}
      </div>
    `;
  }
  
  renderQuickActions() {
    return html`
      ${this.searchHistory.length > 0 ? html`
        <div class="search-section">
          <div class="search-section-title">Recent</div>
          ${this.searchHistory.slice(0, 3).map((item) => html`
            <div 
              class="search-item"
              @click="${() => this.executeResult(item)}">
              <span class="search-item-icon">🕐</span>
              <div class="search-item-content">
                <div class="search-item-title">${item.title}</div>
              </div>
            </div>
          `)}
        </div>
      ` : ''}
      
      <div class="search-section">
        <div class="search-section-title">Quick Actions</div>
        ${this.quickActions.map((action) => html`
          <div 
            class="search-item"
            @click="${() => this.executeResult(action)}">
            <span class="search-item-icon">${action.icon}</span>
            <div class="search-item-content">
              <div class="search-item-title">${action.title}</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }
  
  handleInput(e) {
    this.searchTerm = e.target.value;
    
    // Debounce search
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }
  
  handleFocus() {
    this.isOpen = true;
    if (this.searchTerm) {
      this.performSearch();
    }
  }
  
  handleBlur() {
    // Delay to allow click events
    setTimeout(() => {
      this.isOpen = false;
      this.selectedIndex = -1;
    }, 200);
  }
  
  handleKeydown(e) {
    // Handled by global keyboard shortcuts
  }
  
  performSearch() {
    if (this.searchTerm.length === 0) {
      this.results = [];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.results = this.searchableItems.filter(item => 
      item.title.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
    
    this.selectedIndex = this.results.length > 0 ? 0 : -1;
  }
  
  selectNext() {
    if (this.results.length > 0) {
      this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
    }
  }
  
  selectPrevious() {
    if (this.results.length > 0) {
      this.selectedIndex = this.selectedIndex <= 0 
        ? this.results.length - 1 
        : this.selectedIndex - 1;
    }
  }
  
  executeResult(result) {
    // Add to history
    this.addToHistory(result);
    
    if (result.path) {
      // Navigate to path
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { path: result.path },
        bubbles: true,
        composed: true
      }));
    } else if (result.action) {
      // Execute action
      this.dispatchEvent(new CustomEvent('search-action', {
        detail: { action: result.action },
        bubbles: true,
        composed: true
      }));
    }
    
    // Clear and close
    this.clearSearch();
    this.isOpen = false;
  }
  
  addToHistory(item) {
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(h => h.id !== item.id);
    
    // Add to beginning
    this.searchHistory.unshift(item);
    
    // Keep only last 10
    this.searchHistory = this.searchHistory.slice(0, 10);
    
    // Save to storage
    storage.set('searchHistory', this.searchHistory);
  }
  
  clearSearch() {
    this.searchTerm = '';
    this.results = [];
    this.selectedIndex = -1;
  }
  
  closeSearch() {
    this.isOpen = false;
    this.clearSearch();
    
    // Blur the input
    const input = this.shadowRoot.querySelector('.search-input');
    if (input) {
      input.blur();
    }
  }
  
  focusSearch() {
    const input = this.shadowRoot.querySelector('.search-input');
    if (input) {
      input.focus();
      input.select();
    }
  }
}

customElements.define('app-search-bar', AppSearchBar);