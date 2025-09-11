import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';

export class AppUserMenu extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: relative;
      }
      
      .user-menu-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 20px;
        transition: background-color var(--transition-fast);
        color: var(--color-text-primary);
      }
      
      .user-menu-trigger:hover {
        background-color: var(--color-surface);
      }
      
      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--color-primary);
      }
      
      .user-name {
        font-size: 0.875rem;
        font-weight: 500;
      }
      
      .user-chevron {
        font-size: 0.75rem;
        transition: transform var(--transition-fast);
      }
      
      .user-chevron.open {
        transform: rotate(180deg);
      }
      
      .user-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        width: 240px;
        background-color: var(--color-surface);
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
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
      
      .user-dropdown-header {
        padding: 1rem;
        border-bottom: 1px solid var(--sidebar-border);
      }
      
      .user-dropdown-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-bottom: 0.5rem;
      }
      
      .user-dropdown-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
      }
      
      .user-dropdown-email {
        font-size: 0.813rem;
        color: var(--color-text-secondary);
      }
      
      .user-dropdown-body {
        padding: 0.5rem 0;
      }
      
      .user-menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: var(--color-text-primary);
        text-decoration: none;
        cursor: pointer;
        transition: background-color var(--transition-fast);
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        font-size: 0.875rem;
        font-family: inherit;
      }
      
      .user-menu-item:hover {
        background-color: var(--sidebar-hover);
      }
      
      .user-menu-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
      }
      
      .user-menu-divider {
        height: 1px;
        background-color: var(--sidebar-border);
        margin: 0.5rem 0;
      }
      
      .user-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
      }
      
      .user-status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--color-success);
      }
      
      .user-status-text {
        font-size: 0.813rem;
        color: var(--color-text-secondary);
      }
      
      /* Mobile styles */
      @media (max-width: 767px) {
        .user-name {
          display: none;
        }
        
        .user-menu-trigger {
          padding: 0.25rem;
        }
      }
    `
  ];
  
  static properties = {
    user: { type: Object },
    isOpen: { type: Boolean, state: true }
  };
  
  constructor() {
    super();
    this.user = null;
    this.isOpen = false;
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.setupClickOutside();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeClickOutside();
  }
  
  setupClickOutside() {
    this.clickOutsideHandler = (e) => {
      if (this.isOpen && !this.contains(e.target)) {
        this.isOpen = false;
      }
    };
    
    document.addEventListener('click', this.clickOutsideHandler);
  }
  
  removeClickOutside() {
    if (this.clickOutsideHandler) {
      document.removeEventListener('click', this.clickOutsideHandler);
    }
  }
  
  render() {
    if (!this.user) return '';
    
    return html`
      <button 
        class="user-menu-trigger"
        @click="${this.toggleMenu}"
        aria-label="User menu">
        <img 
          class="user-avatar"
          src="${this.user.avatar}"
          alt="${this.user.name}">
        <span class="user-name">${this.user.name}</span>
        <span class="user-chevron ${this.isOpen ? 'open' : ''}">▼</span>
      </button>
      
      ${this.isOpen ? html`
        <div class="user-dropdown">
          <div class="user-dropdown-header">
            <img 
              class="user-dropdown-avatar"
              src="${this.user.avatar}"
              alt="${this.user.name}">
            <div class="user-dropdown-name">${this.user.name}</div>
            <div class="user-dropdown-email">${this.user.email}</div>
          </div>
          
          <div class="user-status">
            <span class="user-status-indicator"></span>
            <span class="user-status-text">Active</span>
          </div>
          
          <div class="user-dropdown-body">
            <a 
              href="/profile"
              class="user-menu-item"
              @click="${(e) => this.handleNavigation(e, '/profile')}">
              <span class="user-menu-icon">👤</span>
              <span>My Profile</span>
            </a>
            
            <a 
              href="/settings"
              class="user-menu-item"
              @click="${(e) => this.handleNavigation(e, '/settings')}">
              <span class="user-menu-icon">⚙️</span>
              <span>Settings</span>
            </a>
            
            <button 
              class="user-menu-item"
              @click="${this.showActivity}">
              <span class="user-menu-icon">📊</span>
              <span>Activity</span>
            </button>
            
            <div class="user-menu-divider"></div>
            
            <button 
              class="user-menu-item"
              @click="${this.showHelp}">
              <span class="user-menu-icon">❓</span>
              <span>Help & Support</span>
            </button>
            
            <button 
              class="user-menu-item"
              @click="${this.showKeyboardShortcuts}">
              <span class="user-menu-icon">⌨️</span>
              <span>Keyboard Shortcuts</span>
            </button>
            
            <div class="user-menu-divider"></div>
            
            <button 
              class="user-menu-item"
              @click="${this.handleLogout}">
              <span class="user-menu-icon">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ` : ''}
    `;
  }
  
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
  
  handleNavigation(e, path) {
    e.preventDefault();
    
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path },
      bubbles: true,
      composed: true
    }));
    
    this.isOpen = false;
  }
  
  showActivity() {
    console.log('Show activity');
    this.dispatchEvent(new CustomEvent('show-activity', {
      bubbles: true,
      composed: true
    }));
    this.isOpen = false;
  }
  
  showHelp() {
    console.log('Show help');
    this.dispatchEvent(new CustomEvent('show-help', {
      bubbles: true,
      composed: true
    }));
    this.isOpen = false;
  }
  
  showKeyboardShortcuts() {
    console.log('Show keyboard shortcuts');
    this.dispatchEvent(new CustomEvent('show-shortcuts', {
      bubbles: true,
      composed: true
    }));
    this.isOpen = false;
  }
  
  handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
      console.log('Logout');
      this.dispatchEvent(new CustomEvent('logout', {
        bubbles: true,
        composed: true
      }));
      this.isOpen = false;
    }
  }
}

customElements.define('app-user-menu', AppUserMenu);