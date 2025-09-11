import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';

export class DashboardWidget extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }
      
      .widget {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
      }
      
      .widget:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
      
      .widget.dragging {
        opacity: 0.5;
        cursor: move;
      }
      
      .widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      
      .widget-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .widget-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .widget-actions {
        display: flex;
        gap: 0.25rem;
      }
      
      .widget-action {
        width: 32px;
        height: 32px;
        padding: 0;
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius);
        transition: background-color var(--transition-fast);
      }
      
      .widget-action:hover {
        background-color: var(--sidebar-hover);
      }
      
      .widget-content {
        flex: 1;
        overflow: auto;
      }
      
      .widget-footer {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--sidebar-border);
      }
      
      .drag-handle {
        cursor: move;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        z-index: 1;
      }
      
      /* Widget type styles */
      .widget.type-chart .widget-content {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      }
      
      .widget.type-list .widget-content {
        padding: 0;
      }
      
      .widget.type-metric {
        min-height: 150px;
      }
      
      .widget.type-calendar {
        min-height: 300px;
      }
      
      /* Size variations */
      .widget.size-small {
        min-height: 150px;
      }
      
      .widget.size-medium {
        min-height: 250px;
      }
      
      .widget.size-large {
        min-height: 350px;
      }
      
      /* Loading state */
      .widget-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color-text-secondary);
      }
      
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--color-surface-variant);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* Error state */
      .widget-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color-text-secondary);
        text-align: center;
        padding: 1rem;
      }
      
      .error-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--color-error);
      }
      
      /* Empty state */
      .widget-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color-text-secondary);
        text-align: center;
        padding: 1rem;
      }
      
      .empty-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        opacity: 0.5;
      }
    `
  ];
  
  static properties = {
    widgetId: { type: String },
    title: { type: String },
    icon: { type: String },
    type: { type: String }, // chart, list, metric, calendar, custom
    size: { type: String }, // small, medium, large
    loading: { type: Boolean },
    error: { type: String },
    draggable: { type: Boolean },
    collapsible: { type: Boolean },
    collapsed: { type: Boolean },
    refreshable: { type: Boolean },
    removable: { type: Boolean },
    configurable: { type: Boolean },
    footer: { type: String }
  };
  
  constructor() {
    super();
    this.widgetId = '';
    this.title = 'Widget';
    this.icon = '';
    this.type = 'custom';
    this.size = 'medium';
    this.loading = false;
    this.error = null;
    this.draggable = true;
    this.collapsible = true;
    this.collapsed = false;
    this.refreshable = true;
    this.removable = true;
    this.configurable = true;
    this.footer = '';
  }
  
  render() {
    return html`
      <div class="widget type-${this.type} size-${this.size} ${this.dragging ? 'dragging' : ''}">
        ${this.draggable ? html`<div class="drag-handle" @mousedown="${this.handleDragStart}"></div>` : ''}
        
        <div class="widget-header">
          <h3 class="widget-title">
            ${this.icon ? html`<span class="widget-icon">${this.icon}</span>` : ''}
            ${this.title}
          </h3>
          <div class="widget-actions">
            ${this.refreshable ? html`
              <button 
                class="widget-action"
                @click="${this.handleRefresh}"
                title="Refresh">
                🔄
              </button>
            ` : ''}
            ${this.collapsible ? html`
              <button 
                class="widget-action"
                @click="${this.handleCollapse}"
                title="${this.collapsed ? 'Expand' : 'Collapse'}">
                ${this.collapsed ? '▼' : '▲'}
              </button>
            ` : ''}
            ${this.configurable ? html`
              <button 
                class="widget-action"
                @click="${this.handleConfigure}"
                title="Configure">
                ⚙️
              </button>
            ` : ''}
            ${this.removable ? html`
              <button 
                class="widget-action"
                @click="${this.handleRemove}"
                title="Remove">
                ✕
              </button>
            ` : ''}
          </div>
        </div>
        
        ${!this.collapsed ? html`
          <div class="widget-content">
            ${this.loading ? this.renderLoading() :
              this.error ? this.renderError() :
              html`<slot></slot>`}
          </div>
          
          ${this.footer ? html`
            <div class="widget-footer">
              ${this.footer}
            </div>
          ` : ''}
        ` : ''}
      </div>
    `;
  }
  
  renderLoading() {
    return html`
      <div class="widget-loading">
        <div class="loading-spinner"></div>
      </div>
    `;
  }
  
  renderError() {
    return html`
      <div class="widget-error">
        <div class="error-icon">⚠️</div>
        <p>${this.error}</p>
        <button class="btn btn-small" @click="${this.handleRefresh}">
          Retry
        </button>
      </div>
    `;
  }
  
  handleDragStart(e) {
    this.dragging = true;
    
    this.dispatchEvent(new CustomEvent('widget-drag-start', {
      detail: { widgetId: this.widgetId },
      bubbles: true,
      composed: true
    }));
    
    // Set up drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.widgetId);
  }
  
  handleRefresh() {
    this.dispatchEvent(new CustomEvent('widget-refresh', {
      detail: { widgetId: this.widgetId },
      bubbles: true,
      composed: true
    }));
  }
  
  handleCollapse() {
    this.collapsed = !this.collapsed;
    
    this.dispatchEvent(new CustomEvent('widget-collapse', {
      detail: { 
        widgetId: this.widgetId,
        collapsed: this.collapsed
      },
      bubbles: true,
      composed: true
    }));
  }
  
  handleConfigure() {
    this.dispatchEvent(new CustomEvent('widget-configure', {
      detail: { widgetId: this.widgetId },
      bubbles: true,
      composed: true
    }));
  }
  
  handleRemove() {
    if (confirm(`Remove widget "${this.title}"?`)) {
      this.dispatchEvent(new CustomEvent('widget-remove', {
        detail: { widgetId: this.widgetId },
        bubbles: true,
        composed: true
      }));
    }
  }
  
  // Public methods
  refresh() {
    this.loading = true;
    this.error = null;
    
    // Simulate async data loading
    setTimeout(() => {
      this.loading = false;
      // Widget-specific refresh logic would go here
    }, 1000);
  }
  
  setError(message) {
    this.error = message;
    this.loading = false;
  }
  
  clearError() {
    this.error = null;
  }
}

customElements.define('dashboard-widget', DashboardWidget);