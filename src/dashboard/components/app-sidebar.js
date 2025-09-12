import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';

export class AppSidebar extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: fixed;
        top: 60px;
        left: 0;
        bottom: 0;
        width: 260px;
        background-color: var(--sidebar-bg);
        border-right: 1px solid var(--sidebar-border);
        transition: transform var(--transition-normal);
        z-index: 1000;
      }
      
      :host([open]) {
        transform: translateX(0);
      }
      
      :host(:not([open])) {
        transform: translateX(-100%);
      }
      
      .sidebar-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }
      
      .sidebar-header {
        padding: 1.5rem 1rem;
        border-bottom: 1px solid var(--sidebar-border);
      }
      
      .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: var(--color-text-primary);
      }
      
      .brand-icon {
        width: 32px;
        height: 32px;
        background-color: var(--color-primary);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      }
      
      .brand-text {
        font-size: 1.25rem;
        font-weight: 600;
      }
      
      .sidebar-nav {
        flex: 1;
        overflow-y: auto;
        padding: 1rem 0;
      }
      
      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: var(--sidebar-text);
        text-decoration: none;
        transition: all var(--transition-fast);
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        font-size: 0.875rem;
        font-family: inherit;
      }
      
      .nav-item:hover {
        background-color: var(--sidebar-hover);
      }
      
      .nav-item.active {
        background-color: var(--sidebar-active);
        color: var(--sidebar-active-text);
      }
      
      .nav-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .nav-badge {
        margin-left: auto;
        padding: 0.125rem 0.5rem;
        background-color: var(--color-primary);
        color: white;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      
      .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid var(--sidebar-border);
      }
      
      /* Mobile styles */
      @media (max-width: 767px) {
        :host {
          width: 280px;
        }
      }
      
      /* Desktop collapsed state */
      @media (min-width: 1024px) {
        :host(:not([open])) {
          width: 64px;
          transform: translateX(0);
        }
        
        :host(:not([open])) .brand-text,
        :host(:not([open])) .nav-text,
        :host(:not([open])) .nav-badge {
          display: none;
        }
        
        :host(:not([open])) .sidebar-header {
          padding: 1.5rem 1rem;
        }
        
        :host(:not([open])) .nav-item {
          justify-content: center;
        }
      }
    `
  ];
  
  static properties = {
    open: { type: Boolean, reflect: true },
    currentRoute: { type: String },
    responsive: { type: String }
  };
  
  constructor() {
    super();
    this.open = true;
    this.currentRoute = '/';
    this.navigationItems = [
      {
        id: 'home',
        label: 'Home',
        icon: '🏠',
        path: '/',
        badge: null
      },
      {
        id: 'todos',
        label: 'Todos',
        icon: '✓',
        path: '/todos',
        badge: null
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: '📊',
        path: '/analytics',
        badge: null
      },
      {
        id: 'widgets',
        label: 'Dashboard',
        icon: '📋',
        path: '/widgets',
        badge: null
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: '👤',
        path: '/profile',
        badge: null
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: '⚙️',
        path: '/settings',
        badge: null
      }
    ];
  }
  
  render() {
    return html`
      <nav class="sidebar-container">
        <div class="sidebar-header">
          <a href="/" class="brand" @click="${this.handleBrandClick}">
            <div class="brand-icon">D</div>
            <span class="brand-text">Dashboard</span>
          </a>
        </div>
        
        <div class="sidebar-nav">
          ${this.navigationItems.map(item => this.renderNavItem(item))}
        </div>
        
        <div class="sidebar-footer">
          <button class="nav-item ghost" @click="${this.toggleSidebar}">
            <span class="nav-icon">${this.open ? '◀' : '▶'}</span>
            <span class="nav-text">Collapse</span>
          </button>
        </div>
      </nav>
    `;
  }
  
  renderNavItem(item) {
    const isActive = this.currentRoute === item.path;
    
    return html`
      <a
        href="${item.path}"
        class="nav-item ${isActive ? 'active' : ''}"
        @click="${(e) => this.handleNavClick(e, item)}"
        title="${item.label}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-text">${item.label}</span>
        ${item.badge ? html`
          <span class="nav-badge">${item.badge}</span>
        ` : ''}
      </a>
    `;
  }
  
  handleNavClick(e, item) {
    e.preventDefault();
    
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: item.path, item },
      bubbles: true,
      composed: true
    }));
  }
  
  handleBrandClick(e) {
    e.preventDefault();
    
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: '/' },
      bubbles: true,
      composed: true
    }));
  }
  
  toggleSidebar() {
    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('app-sidebar', AppSidebar);