import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';
import { themeService } from '../services/theme-service.js';
import './app-search-bar.js';
import './app-notifications.js';
import './app-user-menu.js';

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
      
      
      .header-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .theme-button {
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
      }
      
      .theme-button:hover {
        background-color: var(--color-surface);
      }
      
      /* Mobile styles */
      @media (max-width: 767px) {
        app-search-bar {
          display: none;
        }
      }
    `
  ];
  
  static properties = {
    user: { type: Object },
    theme: { type: String }
  };
  
  constructor() {
    super();
    this.user = null;
    this.theme = 'light';
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
          <app-search-bar
            @navigate="${this.handleNavigate}"
            @search-action="${this.handleSearchAction}">
          </app-search-bar>
        </div>
        
        <div class="header-right">
          <button
            class="theme-button"
            @click="${this.toggleTheme}"
            aria-label="Toggle theme"
            title="${this.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}">
            ${this.theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <app-notifications
            @navigate="${this.handleNavigate}"
            @notification-action="${this.handleNotificationAction}">
          </app-notifications>
          
          <app-user-menu
            .user="${this.user}"
            @navigate="${this.handleNavigate}"
            @logout="${this.handleLogout}"
            @show-activity="${this.handleShowActivity}"
            @show-help="${this.handleShowHelp}"
            @show-shortcuts="${this.handleShowShortcuts}">
          </app-user-menu>
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
  
  handleNavigate(e) {
    // Pass navigation events up
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }
  
  handleSearchAction(e) {
    const { action } = e.detail;
    
    if (action === 'toggle-theme' || action === 'theme-light' || action === 'theme-dark') {
      if (action === 'theme-light') {
        themeService.applyTheme('light');
      } else if (action === 'theme-dark') {
        themeService.applyTheme('dark');
      } else {
        this.toggleTheme();
      }
    }
  }
  
  handleNotificationAction(e) {
    console.log('Notification action:', e.detail);
  }
  
  handleLogout() {
    console.log('User logout');
    // Implement logout logic
  }
  
  handleShowActivity() {
    console.log('Show activity');
    // Navigate to activity page or show modal
  }
  
  handleShowHelp() {
    console.log('Show help');
    // Show help modal or navigate to help page
  }
  
  handleShowShortcuts() {
    console.log('Show keyboard shortcuts');
    // Show keyboard shortcuts modal
  }
}

customElements.define('app-header', AppHeader);