import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { themeService } from '../services/theme-service.js';
import './app-search-bar.js';
import './app-notifications.js';
import './app-user-menu.js';

interface User {
  name: string;
  email: string;
  avatar: string;
}

@customElement('app-header')
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
  
  @property({ type: Object })
  user: User | null = null;
  
  @property({ type: String })
  theme = 'light';
  
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
  
  private toggleSidebar(): void {
    this.dispatchEvent(new CustomEvent('toggle-sidebar', {
      bubbles: true,
      composed: true
    }));
  }
  
  private toggleTheme(): void {
    const newTheme = themeService.toggleTheme();
    
    this.dispatchEvent(new CustomEvent('theme-change', {
      detail: { theme: newTheme },
      bubbles: true,
      composed: true
    }));
  }
  
  private handleNavigate(e: CustomEvent<{ path: string }>): void {
    // Pass navigation events up
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }
  
  private handleSearchAction(e: CustomEvent<{ action: string }>): void {
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
  
  private handleNotificationAction(e: CustomEvent): void {
    console.log('Notification action:', e.detail);
  }
  
  private handleLogout(): void {
    console.log('User logout');
    // Implement logout logic
  }
  
  private handleShowActivity(): void {
    console.log('Show activity');
    // Navigate to activity page or show modal
  }
  
  private handleShowHelp(): void {
    console.log('Show help');
    // Show help modal or navigate to help page
  }
  
  private handleShowShortcuts(): void {
    console.log('Show keyboard shortcuts');
    // Show keyboard shortcuts modal
  }
}