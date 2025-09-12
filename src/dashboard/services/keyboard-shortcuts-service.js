/**
 * Keyboard Shortcuts Service
 * Global keyboard shortcut management for the dashboard
 */

class KeyboardShortcutsService {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;
    this.activeModals = new Set();
    this.init();
  }
  
  init() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Register default shortcuts
    this.registerDefaults();
  }
  
  registerDefaults() {
    // Navigation shortcuts
    this.register('Alt+1', () => this.navigate('/todos'), 'Go to Todos');
    this.register('Alt+2', () => this.navigate('/analytics'), 'Go to Analytics');
    this.register('Alt+3', () => this.navigate('/widgets'), 'Go to Widgets');
    this.register('Alt+4', () => this.navigate('/profile'), 'Go to Profile');
    this.register('Alt+5', () => this.navigate('/settings'), 'Go to Settings');
    
    // Action shortcuts
    this.register('Ctrl+K', () => this.focusSearch(), 'Focus search');
    this.register('Cmd+K', () => this.focusSearch(), 'Focus search (Mac)');
    this.register('Ctrl+/', () => this.showShortcuts(), 'Show keyboard shortcuts');
    this.register('Cmd+/', () => this.showShortcuts(), 'Show keyboard shortcuts (Mac)');
    this.register('Ctrl+\\', () => this.toggleSidebar(), 'Toggle sidebar');
    this.register('Cmd+\\', () => this.toggleSidebar(), 'Toggle sidebar (Mac)');
    this.register('Ctrl+Shift+T', () => this.toggleTheme(), 'Toggle theme');
    this.register('Cmd+Shift+T', () => this.toggleTheme(), 'Toggle theme (Mac)');
    
    // Modal/dropdown management
    this.register('Escape', () => this.closeActiveModal(), 'Close modal/dropdown');
  }
  
  handleKeydown(e) {
    if (!this.enabled) return;
    
    // Don't handle shortcuts when typing in input fields
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
      // Allow Escape and Ctrl/Cmd+K even in inputs
      if (e.key !== 'Escape' && !((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        return;
      }
    }
    
    // Build shortcut string
    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.metaKey) parts.push('Cmd');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.key && e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Alt' && e.key !== 'Shift') {
      // Normalize key names
      let key = e.key;
      if (key === ' ') key = 'Space';
      if (key === 'ArrowUp') key = 'Up';
      if (key === 'ArrowDown') key = 'Down';
      if (key === 'ArrowLeft') key = 'Left';
      if (key === 'ArrowRight') key = 'Right';
      parts.push(key.charAt(0).toUpperCase() + key.slice(1));
    }
    
    const shortcut = parts.join('+');
    
    const handler = this.shortcuts.get(shortcut);
    if (handler) {
      e.preventDefault();
      e.stopPropagation();
      handler.callback();
    }
  }
  
  register(shortcut, callback, description = '') {
    this.shortcuts.set(shortcut, { callback, description });
  }
  
  unregister(shortcut) {
    this.shortcuts.delete(shortcut);
  }
  
  enable() {
    this.enabled = true;
  }
  
  disable() {
    this.enabled = false;
  }
  
  // Shortcut actions
  navigate(path) {
    window.dispatchEvent(new CustomEvent('navigate', {
      detail: { path },
      bubbles: true,
      composed: true
    }));
  }
  
  focusSearch() {
    const searchBar = document.querySelector('app-dashboard')
      ?.shadowRoot?.querySelector('app-header')
      ?.shadowRoot?.querySelector('app-search-bar');
    
    if (searchBar) {
      searchBar.focusSearch();
    }
  }
  
  showShortcuts() {
    this.showShortcutsModal();
  }
  
  toggleSidebar() {
    window.dispatchEvent(new CustomEvent('toggle-sidebar', {
      detail: { source: 'keyboard' },
      bubbles: true,
      composed: true
    }));
  }
  
  toggleTheme() {
    window.dispatchEvent(new CustomEvent('toggle-theme', {
      bubbles: true,
      composed: true
    }));
  }
  
  closeActiveModal() {
    // Close any open modals or dropdowns
    window.dispatchEvent(new CustomEvent('close-modals', {
      bubbles: true,
      composed: true
    }));
  }
  
  showShortcutsModal() {
    // Create and show keyboard shortcuts modal
    const modal = document.createElement('div');
    modal.className = 'keyboard-shortcuts-modal';
    modal.innerHTML = `
      <style>
        .keyboard-shortcuts-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .shortcuts-dialog {
          background-color: white;
          border-radius: 8px;
          padding: 2rem;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .shortcuts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .shortcuts-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        
        .shortcuts-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0.25rem;
        }
        
        .shortcuts-close:hover {
          color: #333;
        }
        
        .shortcuts-section {
          margin-bottom: 1.5rem;
        }
        
        .shortcuts-section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #333;
        }
        
        .shortcut-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }
        
        .shortcut-item:last-child {
          border-bottom: none;
        }
        
        .shortcut-description {
          color: #666;
        }
        
        .shortcut-keys {
          display: flex;
          gap: 0.25rem;
        }
        
        .shortcut-key {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          font-family: monospace;
          color: #333;
        }
        
        @media (prefers-color-scheme: dark) {
          .shortcuts-dialog {
            background-color: #1a1a1a;
            color: #e5e5e5;
          }
          
          .shortcuts-close {
            color: #999;
          }
          
          .shortcuts-close:hover {
            color: #ccc;
          }
          
          .shortcuts-section-title {
            color: #e5e5e5;
          }
          
          .shortcut-description {
            color: #999;
          }
          
          .shortcut-key {
            background-color: #2a2a2a;
            border-color: #444;
            color: #e5e5e5;
          }
          
          .shortcut-item {
            border-bottom-color: #333;
          }
        }
      </style>
      <div class="shortcuts-dialog">
        <div class="shortcuts-header">
          <h2 class="shortcuts-title">Keyboard Shortcuts</h2>
          <button class="shortcuts-close">&times;</button>
        </div>
        
        <div class="shortcuts-section">
          <h3 class="shortcuts-section-title">Navigation</h3>
          ${this.renderShortcutGroup(['Alt+1', 'Alt+2', 'Alt+3', 'Alt+4', 'Alt+5'])}
        </div>
        
        <div class="shortcuts-section">
          <h3 class="shortcuts-section-title">Actions</h3>
          ${this.renderShortcutGroup(['Ctrl+K', 'Cmd+K', 'Ctrl+/', 'Cmd+/', 'Ctrl+\\', 'Cmd+\\', 'Ctrl+Shift+T', 'Cmd+Shift+T'])}
        </div>
        
        <div class="shortcuts-section">
          <h3 class="shortcuts-section-title">General</h3>
          ${this.renderShortcutGroup(['Escape'])}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    const closeModal = () => {
      document.body.removeChild(modal);
    };
    
    modal.querySelector('.shortcuts-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Close on Escape
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }
  
  renderShortcutGroup(shortcuts) {
    return shortcuts
      .map(shortcut => {
        const handler = this.shortcuts.get(shortcut);
        if (!handler) return '';
        
        const keys = shortcut.split('+').map(key => `<span class="shortcut-key">${key}</span>`).join('');
        
        return `
          <div class="shortcut-item">
            <span class="shortcut-description">${handler.description}</span>
            <div class="shortcut-keys">${keys}</div>
          </div>
        `;
      })
      .join('');
  }
  
  // Get list of all registered shortcuts
  getShortcuts() {
    const shortcuts = [];
    this.shortcuts.forEach((handler, shortcut) => {
      shortcuts.push({
        shortcut,
        description: handler.description
      });
    });
    return shortcuts;
  }
}

// Create and export singleton instance
export const keyboardShortcuts = new KeyboardShortcutsService();