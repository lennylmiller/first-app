import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';
import { storage } from '../services/storage-service.js';

export class AppNotifications extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: relative;
      }
      
      .notifications-trigger {
        position: relative;
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
      
      .notifications-trigger:hover {
        background-color: var(--color-surface);
      }
      
      .notifications-badge {
        position: absolute;
        top: 6px;
        right: 6px;
        min-width: 18px;
        height: 18px;
        padding: 0 4px;
        background-color: var(--color-error);
        color: white;
        border-radius: 9px;
        font-size: 0.625rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .notifications-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        width: 360px;
        max-width: 90vw;
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
      
      .notifications-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid var(--sidebar-border);
      }
      
      .notifications-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
      
      .notifications-actions {
        display: flex;
        gap: 0.5rem;
      }
      
      .notifications-action {
        padding: 0.25rem 0.5rem;
        background: none;
        border: none;
        color: var(--color-primary);
        font-size: 0.75rem;
        cursor: pointer;
        border-radius: var(--border-radius);
        transition: background-color var(--transition-fast);
      }
      
      .notifications-action:hover {
        background-color: var(--sidebar-hover);
      }
      
      .notifications-body {
        max-height: 400px;
        overflow-y: auto;
      }
      
      .notifications-empty {
        padding: 3rem 2rem;
        text-align: center;
        color: var(--color-text-secondary);
      }
      
      .notifications-empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }
      
      .notification-item {
        padding: 1rem;
        border-bottom: 1px solid var(--sidebar-border);
        cursor: pointer;
        transition: background-color var(--transition-fast);
        position: relative;
      }
      
      .notification-item:hover {
        background-color: var(--sidebar-hover);
      }
      
      .notification-item:last-child {
        border-bottom: none;
      }
      
      .notification-item.unread {
        background-color: var(--color-surface-variant);
      }
      
      .notification-item.unread::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: var(--color-primary);
      }
      
      .notification-header {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }
      
      .notification-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .notification-icon.info {
        background-color: rgba(33, 150, 243, 0.1);
        color: var(--color-info);
      }
      
      .notification-icon.success {
        background-color: rgba(76, 175, 80, 0.1);
        color: var(--color-success);
      }
      
      .notification-icon.warning {
        background-color: rgba(255, 152, 0, 0.1);
        color: var(--color-warning);
      }
      
      .notification-icon.error {
        background-color: rgba(244, 67, 54, 0.1);
        color: var(--color-error);
      }
      
      .notification-content {
        flex: 1;
      }
      
      .notification-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
      }
      
      .notification-message {
        font-size: 0.813rem;
        color: var(--color-text-secondary);
        line-height: 1.4;
      }
      
      .notification-time {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        margin-top: 0.25rem;
      }
      
      .notification-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      
      .notification-action-btn {
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        border-radius: var(--border-radius);
      }
      
      .notifications-footer {
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--sidebar-border);
        text-align: center;
      }
      
      .notifications-footer a {
        color: var(--color-primary);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
      }
    `
  ];
  
  static properties = {
    notifications: { type: Array, state: true },
    isOpen: { type: Boolean, state: true },
    unreadCount: { type: Number }
  };
  
  constructor() {
    super();
    this.notifications = this.loadNotifications();
    this.isOpen = false;
    this.unreadCount = 0;
    this.updateUnreadCount();
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.setupClickOutside();
    
    // Simulate receiving notifications
    this.simulateNotifications();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeClickOutside();
    if (this.simulationTimeout) {
      clearTimeout(this.simulationTimeout);
    }
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
    return html`
      <button 
        class="notifications-trigger"
        @click="${this.toggleDropdown}"
        aria-label="Notifications">
        🔔
        ${this.unreadCount > 0 ? html`
          <span class="notifications-badge">
            ${this.unreadCount > 99 ? '99+' : this.unreadCount}
          </span>
        ` : ''}
      </button>
      
      ${this.isOpen ? html`
        <div class="notifications-dropdown">
          ${this.renderDropdownContent()}
        </div>
      ` : ''}
    `;
  }
  
  renderDropdownContent() {
    return html`
      <div class="notifications-header">
        <h3 class="notifications-title">Notifications</h3>
        <div class="notifications-actions">
          ${this.unreadCount > 0 ? html`
            <button 
              class="notifications-action"
              @click="${this.markAllAsRead}">
              Mark all read
            </button>
          ` : ''}
          <button 
            class="notifications-action"
            @click="${this.clearAll}">
            Clear all
          </button>
        </div>
      </div>
      
      <div class="notifications-body">
        ${this.notifications.length === 0 ? html`
          <div class="notifications-empty">
            <div class="notifications-empty-icon">🔔</div>
            <p>No notifications yet</p>
            <p style="font-size: 0.75rem; margin-top: 0.5rem;">
              You'll see updates here when there's activity
            </p>
          </div>
        ` : html`
          ${this.notifications.map(notification => this.renderNotification(notification))}
        `}
      </div>
      
      ${this.notifications.length > 0 ? html`
        <div class="notifications-footer">
          <a href="#" @click="${(e) => { e.preventDefault(); this.viewAll(); }}">
            View all notifications
          </a>
        </div>
      ` : ''}
    `;
  }
  
  renderNotification(notification) {
    const iconMap = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    
    return html`
      <div 
        class="notification-item ${notification.read ? '' : 'unread'}"
        @click="${() => this.handleNotificationClick(notification)}">
        <div class="notification-header">
          <div class="notification-icon ${notification.type}">
            ${iconMap[notification.type] || 'ℹ️'}
          </div>
          <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
            ${notification.actions && notification.actions.length > 0 ? html`
              <div class="notification-actions">
                ${notification.actions.map(action => html`
                  <button 
                    class="notification-action-btn"
                    @click="${(e) => this.handleAction(e, action)}">
                    ${action.label}
                  </button>
                `)}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  
  handleNotificationClick(notification) {
    if (!notification.read) {
      notification.read = true;
      this.updateUnreadCount();
      this.saveNotifications();
      this.requestUpdate();
    }
    
    if (notification.link) {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { path: notification.link },
        bubbles: true,
        composed: true
      }));
      this.isOpen = false;
    }
  }
  
  handleAction(e, action) {
    e.stopPropagation();
    
    this.dispatchEvent(new CustomEvent('notification-action', {
      detail: { action },
      bubbles: true,
      composed: true
    }));
  }
  
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
    this.saveNotifications();
    this.requestUpdate();
  }
  
  clearAll() {
    if (confirm('Clear all notifications?')) {
      this.notifications = [];
      this.updateUnreadCount();
      this.saveNotifications();
      this.requestUpdate();
    }
  }
  
  viewAll() {
    console.log('View all notifications');
    this.isOpen = false;
  }
  
  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }
  
  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
  
  loadNotifications() {
    return storage.get('notifications', []);
  }
  
  saveNotifications() {
    storage.set('notifications', this.notifications);
  }
  
  addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: Date.now(),
      read: false,
      type: 'info',
      ...notification
    };
    
    this.notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    this.notifications = this.notifications.slice(0, 50);
    
    this.updateUnreadCount();
    this.saveNotifications();
    this.requestUpdate();
    
    return newNotification;
  }
  
  simulateNotifications() {
    // Add a welcome notification if first time
    if (this.notifications.length === 0) {
      this.addNotification({
        title: 'Welcome to Dashboard!',
        message: 'Your new dashboard is ready to use. Explore the features and customize your experience.',
        type: 'success'
      });
    }
    
    // Simulate random notifications
    this.simulationTimeout = setTimeout(() => {
      const notifications = [
        {
          title: 'Task Completed',
          message: 'Your task "Implement dashboard" has been marked as complete.',
          type: 'success',
          link: '/todos'
        },
        {
          title: 'New Update Available',
          message: 'A new version of the dashboard is available with performance improvements.',
          type: 'info',
          actions: [
            { label: 'Update Now', action: 'update' },
            { label: 'Later', action: 'dismiss' }
          ]
        },
        {
          title: 'Reminder',
          message: 'You have 3 pending tasks that need your attention.',
          type: 'warning',
          link: '/todos'
        }
      ];
      
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      this.addNotification(randomNotification);
      
      // Schedule next notification
      this.simulateNotifications();
    }, 30000 + Math.random() * 60000); // Random between 30-90 seconds
  }
}

customElements.define('app-notifications', AppNotifications);