import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';
import { themeService } from '../services/theme-service.js';

export class AppHeader extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 1001;
      }
      
      .header-container {
        height: 60px;
        background-color: var(--header-bg);
        border-bottom: 1px solid var(--sidebar-border);
        box-shadow: var(--header-shadow);
        display: flex;
        align-items: center;
        padding: 0 1rem;
        gap: 1rem;
      }
      
      .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .menu-toggle {
        padding: 0.5rem;
        background: none;
        border: none;
        color: var(--color-text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius);
        transition: background-color var(--transition-fast);
      }
      
      .menu-toggle:hover {
        background-color: var(--color-surface);
      }
      
      .header-center {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .search-container {
        position: relative;
        width: 100%;
        max-width: 400px;
      }
      
      .search-input {
        width: 100%;
        padding: 0.5rem 1rem;
        padding-left: 2.5rem;
        border: 1px solid var(--input-border);
        border-radius: 20px;
        background-color: var(--color-surface);
        color: var(--color-text-primary);
        font-size: 0.875rem;
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
      
      .header-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .icon-button {
        width: 40px;
        height: 40px;
        padding: 0;
        background: none;
        border: none;
        color: var(--color-text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color var(--transition-fast);
        position: relative;
      }
      
      .icon-button:hover {
        background-color: var(--color-surface);
      }
      
      .notification-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 8px;
        height: 8px;
        background-color: var(--color-error);
        border-radius: 50%;
      }
      
      .user-menu {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 20px;
        transition: background-color var(--transition-fast);
      }
      
      .user-menu:hover {
        background-color: var(--color-surface);
      }
      
      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .user-name {
        font-size: 0.875rem;
        color: var(--color-text-primary);
        font-weight: 500;
      }
      
      /* Mobile styles */
      @media (max-width: 767px) {
        .search-container {
          display: none;
        }
        
        .user-name {
          display: none;
        }
      }
    `
  ];
  
  static properties = {
    user: { type: Object },
    theme: { type: String },
    notifications: { type: Number }
  };
  
  constructor() {
    super();
    this.user = null;
    this.theme = 'light';
    this.notifications = 0;
  }
  
  render() {
    return html`
      <header class="header-container">
        <div class="header-left">
          <button 
            class="menu-toggle"
            @click="${this.toggleSidebar}"
            aria-label="Toggle sidebar">
            ☰
          </button>
        </div>
        
        <div class="header-center">
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input
              type="search"
              class="search-input"
              placeholder="Search... (Cmd/Ctrl + K)"
              @keydown="${this.handleSearchKeydown}">
          </div>
        </div>
        
        <div class="header-right">
          <button
            class="icon-button"
            @click="${this.toggleTheme}"
            aria-label="Toggle theme"
            title="${this.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}">
            ${this.theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button
            class="icon-button"
            @click="${this.showNotifications}"
            aria-label="Notifications">
            🔔
            ${this.notifications > 0 ? html`
              <span class="notification-badge"></span>
            ` : ''}
          </button>
          
          ${this.user ? html`
            <button class="user-menu" @click="${this.toggleUserMenu}">
              <img 
                class="user-avatar"
                src="${this.user.avatar}"
                alt="${this.user.name}">
              <span class="user-name">${this.user.name}</span>
              <span>▼</span>
            </button>
          ` : ''}
        </div>
      </header>
    `;
  }
  
  toggleSidebar() {
    this.dispatchEvent(new CustomEvent('toggle-sidebar', {
      bubbles: true,
      composed: true
    }));
  }
  
  toggleTheme() {
    const newTheme = themeService.toggleTheme();
    
    this.dispatchEvent(new CustomEvent('theme-change', {
      detail: { theme: newTheme },
      bubbles: true,
      composed: true
    }));
  }
  
  showNotifications() {
    // Will be implemented when notifications component is created
    console.log('Show notifications');
  }
  
  toggleUserMenu() {
    // Will be implemented when user menu component is created
    console.log('Toggle user menu');
  }
  
  handleSearchKeydown(e) {
    // Implement Cmd/Ctrl + K shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      e.target.focus();
    }
  }
}

customElements.define('app-header', AppHeader);