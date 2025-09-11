import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';
import { storage } from '../services/storage-service.js';
import '../components/dashboard-widget.js';

export class WidgetsView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        min-height: 0;
        overflow: auto;
      }
      
      .widgets-container {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      @media (max-width: 768px) {
        .widgets-container {
          padding: 1rem;
        }
      }
      
      @media (max-width: 480px) {
        .widgets-container {
          padding: 0.75rem;
        }
      }
      
      .widgets-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      @media (max-width: 640px) {
        .widgets-header {
          flex-direction: column;
          align-items: stretch;
        }
        
        .widgets-header h1 {
          font-size: 1.5rem;
        }
      }
      
      .header-actions {
        display: flex;
        gap: 0.5rem;
      }
      
      .widgets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      @media (max-width: 768px) {
        .widgets-grid {
          grid-template-columns: 1fr;
        }
        
        .widget-wrapper.span-2,
        .widget-wrapper.span-3 {
          grid-column: span 1;
        }
      }
      
      .widget-wrapper {
        position: relative;
      }
      
      .widget-wrapper.span-2 {
        grid-column: span 2;
      }
      
      .widget-wrapper.span-3 {
        grid-column: span 3;
      }
      
      .widget-wrapper.full-width {
        grid-column: 1 / -1;
      }
      
      .add-widget-card {
        background-color: var(--color-surface);
        border: 2px dashed var(--input-border);
        border-radius: var(--border-radius-lg);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        cursor: pointer;
        transition: all var(--transition-fast);
      }
      
      .add-widget-card:hover {
        border-color: var(--color-primary);
        background-color: var(--sidebar-hover);
      }
      
      .add-widget-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }
      
      .add-widget-text {
        color: var(--color-text-secondary);
        font-size: 0.875rem;
      }
      
      /* Widget content styles */
      .clock-widget {
        text-align: center;
        padding: 2rem;
      }
      
      .clock-time {
        font-size: 3rem;
        font-weight: 300;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
        font-family: monospace;
      }
      
      .clock-date {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
      }
      
      .weather-widget {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 1rem;
      }
      
      .weather-icon {
        font-size: 4rem;
      }
      
      .weather-info {
        flex: 1;
      }
      
      .weather-temp {
        font-size: 2.5rem;
        font-weight: 300;
        color: var(--color-text-primary);
      }
      
      .weather-desc {
        font-size: 1rem;
        color: var(--color-text-secondary);
        margin-bottom: 0.5rem;
      }
      
      .weather-details {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
      
      .news-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .news-item {
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--sidebar-border);
      }
      
      .news-item:last-child {
        border-bottom: none;
      }
      
      .news-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
      }
      
      .news-meta {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
      }
      
      .quote-widget {
        text-align: center;
        padding: 2rem;
      }
      
      .quote-text {
        font-size: 1.25rem;
        font-style: italic;
        color: var(--color-text-primary);
        margin-bottom: 1rem;
        line-height: 1.6;
      }
      
      .quote-author {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
      
      .chart-placeholder {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-surface-variant);
        border-radius: var(--border-radius);
        color: var(--color-text-secondary);
      }
      
      .metric-value {
        font-size: 3rem;
        font-weight: 600;
        color: var(--color-primary);
        text-align: center;
        margin-bottom: 0.5rem;
      }
      
      .metric-label {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        text-align: center;
      }
      
      .metric-trend {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
        font-size: 0.875rem;
      }
      
      .trend-positive {
        color: var(--color-success);
      }
      
      .trend-negative {
        color: var(--color-error);
      }
      
      /* Drag and drop styles */
      .widget-wrapper.drag-over {
        opacity: 0.5;
      }
      
      .drop-zone {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px dashed var(--color-primary);
        border-radius: var(--border-radius-lg);
        background-color: rgba(33, 150, 243, 0.1);
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--transition-fast);
      }
      
      .drop-zone.active {
        opacity: 1;
      }
      
      /* Widget library modal */
      .widget-library {
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
      }
      
      .widget-library-dialog {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 2rem;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: var(--shadow-lg);
      }
      
      .library-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      
      .library-title {
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .library-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-text-secondary);
      }
      
      .library-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
      
      .library-widget {
        background-color: var(--color-background);
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        padding: 1rem;
        text-align: center;
        cursor: pointer;
        transition: all var(--transition-fast);
      }
      
      .library-widget:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
      }
      
      .library-widget-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      
      .library-widget-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
      }
      
      /* Mobile styles */
      @media (max-width: 767px) {
        .widgets-grid {
          grid-template-columns: 1fr;
        }
        
        .widget-wrapper.span-2,
        .widget-wrapper.span-3,
        .widget-wrapper.full-width {
          grid-column: 1;
        }
      }
    `
  ];
  
  static properties = {
    widgets: { type: Array, state: true },
    showLibrary: { type: Boolean, state: true },
    currentTime: { type: String, state: true },
    currentDate: { type: String, state: true }
  };
  
  constructor() {
    super();
    this.widgets = [];
    this.showLibrary = false;
    this.currentTime = '';
    this.currentDate = '';
    
    this.loadWidgets();
    this.startClock();
  }
  
  loadWidgets() {
    // Load saved widgets or create defaults
    const savedWidgets = storage.get('dashboardWidgets', null);
    
    if (savedWidgets) {
      this.widgets = savedWidgets;
    } else {
      this.widgets = this.getDefaultWidgets();
      this.saveWidgets();
    }
  }
  
  getDefaultWidgets() {
    return [
      {
        id: 'clock-1',
        type: 'clock',
        title: 'Clock',
        icon: '🕐',
        size: 'small',
        span: 1
      },
      {
        id: 'weather-1',
        type: 'weather',
        title: 'Weather',
        icon: '🌤️',
        size: 'small',
        span: 1
      },
      {
        id: 'metrics-1',
        type: 'metrics',
        title: 'Today\'s Progress',
        icon: '📊',
        size: 'medium',
        span: 1
      },
      {
        id: 'news-1',
        type: 'news',
        title: 'Latest Updates',
        icon: '📰',
        size: 'medium',
        span: 2
      },
      {
        id: 'chart-1',
        type: 'chart',
        title: 'Activity Chart',
        icon: '📈',
        size: 'medium',
        span: 2
      },
      {
        id: 'quote-1',
        type: 'quote',
        title: 'Daily Quote',
        icon: '💭',
        size: 'small',
        span: 1
      }
    ];
  }
  
  startClock() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }
  
  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  render() {
    return html`
      <div class="widgets-container">
        <div class="widgets-header">
          <h1>Dashboard Widgets</h1>
          <div class="header-actions">
            <button class="btn btn-secondary" @click="${this.resetWidgets}">
              Reset Layout
            </button>
            <button class="btn btn-primary" @click="${this.openWidgetLibrary}">
              ➕ Add Widget
            </button>
          </div>
        </div>
        
        <div class="widgets-grid">
          ${this.widgets.map(widget => this.renderWidget(widget))}
          
          <div class="widget-wrapper">
            <div class="add-widget-card" @click="${this.openWidgetLibrary}">
              <div class="add-widget-icon">➕</div>
              <div class="add-widget-text">Add New Widget</div>
            </div>
          </div>
        </div>
      </div>
      
      ${this.showLibrary ? this.renderWidgetLibrary() : ''}
    `;
  }
  
  renderWidget(widget) {
    return html`
      <div class="widget-wrapper span-${widget.span || 1}">
        <dashboard-widget
          .widgetId="${widget.id}"
          .title="${widget.title}"
          .icon="${widget.icon}"
          .type="${widget.type}"
          .size="${widget.size}"
          @widget-refresh="${this.handleWidgetRefresh}"
          @widget-remove="${this.handleWidgetRemove}"
          @widget-configure="${this.handleWidgetConfigure}">
          ${this.renderWidgetContent(widget)}
        </dashboard-widget>
      </div>
    `;
  }
  
  renderWidgetContent(widget) {
    switch (widget.type) {
      case 'clock':
        return html`
          <div class="clock-widget">
            <div class="clock-time">${this.currentTime}</div>
            <div class="clock-date">${this.currentDate}</div>
          </div>
        `;
        
      case 'weather':
        return html`
          <div class="weather-widget">
            <div class="weather-icon">☀️</div>
            <div class="weather-info">
              <div class="weather-temp">72°F</div>
              <div class="weather-desc">Sunny</div>
              <div class="weather-details">
                <span>💨 5 mph</span>
                <span>💧 45%</span>
              </div>
            </div>
          </div>
        `;
        
      case 'metrics':
        return html`
          <div class="metrics-widget">
            <div class="metric-value">87%</div>
            <div class="metric-label">Productivity Score</div>
            <div class="metric-trend trend-positive">
              <span>↑</span>
              <span>+12% from yesterday</span>
            </div>
          </div>
        `;
        
      case 'news':
        return html`
          <ul class="news-list">
            <li class="news-item">
              <div class="news-title">Dashboard Phase 3 Implementation Started</div>
              <div class="news-meta">2 hours ago • Development</div>
            </li>
            <li class="news-item">
              <div class="news-title">Analytics Dashboard Now Live</div>
              <div class="news-meta">5 hours ago • Features</div>
            </li>
            <li class="news-item">
              <div class="news-title">New Keyboard Shortcuts Available</div>
              <div class="news-meta">1 day ago • Updates</div>
            </li>
            <li class="news-item">
              <div class="news-title">Performance Improvements Deployed</div>
              <div class="news-meta">2 days ago • System</div>
            </li>
          </ul>
        `;
        
      case 'chart':
        return html`
          <div class="chart-placeholder">
            📊 Chart visualization
          </div>
        `;
        
      case 'quote':
        return html`
          <div class="quote-widget">
            <div class="quote-text">
              "The only way to do great work is to love what you do."
            </div>
            <div class="quote-author">— Steve Jobs</div>
          </div>
        `;
        
      default:
        return html`
          <div style="padding: 1rem; text-align: center; color: var(--color-text-secondary);">
            Custom widget content
          </div>
        `;
    }
  }
  
  renderWidgetLibrary() {
    const availableWidgets = [
      { type: 'clock', name: 'Clock', icon: '🕐' },
      { type: 'weather', name: 'Weather', icon: '🌤️' },
      { type: 'metrics', name: 'Metrics', icon: '📊' },
      { type: 'news', name: 'News Feed', icon: '📰' },
      { type: 'chart', name: 'Chart', icon: '📈' },
      { type: 'quote', name: 'Daily Quote', icon: '💭' },
      { type: 'calendar', name: 'Calendar', icon: '📅' },
      { type: 'tasks', name: 'Task List', icon: '✅' },
      { type: 'notes', name: 'Notes', icon: '📝' },
      { type: 'timer', name: 'Timer', icon: '⏱️' },
      { type: 'calculator', name: 'Calculator', icon: '🧮' },
      { type: 'stocks', name: 'Stock Ticker', icon: '📈' }
    ];
    
    return html`
      <div class="widget-library" @click="${this.closeWidgetLibrary}">
        <div class="widget-library-dialog" @click="${(e) => e.stopPropagation()}">
          <div class="library-header">
            <h2 class="library-title">Widget Library</h2>
            <button class="library-close" @click="${this.closeWidgetLibrary}">
              ✕
            </button>
          </div>
          
          <div class="library-grid">
            ${availableWidgets.map(widget => html`
              <div class="library-widget" @click="${() => this.addWidget(widget)}">
                <div class="library-widget-icon">${widget.icon}</div>
                <div class="library-widget-name">${widget.name}</div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }
  
  openWidgetLibrary() {
    this.showLibrary = true;
  }
  
  closeWidgetLibrary() {
    this.showLibrary = false;
  }
  
  addWidget(widgetTemplate) {
    const newWidget = {
      id: `${widgetTemplate.type}-${Date.now()}`,
      type: widgetTemplate.type,
      title: widgetTemplate.name,
      icon: widgetTemplate.icon,
      size: 'medium',
      span: widgetTemplate.type === 'news' || widgetTemplate.type === 'chart' ? 2 : 1
    };
    
    this.widgets = [...this.widgets, newWidget];
    this.saveWidgets();
    this.closeWidgetLibrary();
  }
  
  handleWidgetRefresh(e) {
    const widgetId = e.detail.widgetId;
    console.log('Refreshing widget:', widgetId);
    
    // Find and refresh the specific widget
    const widgetElement = this.shadowRoot.querySelector(`dashboard-widget[widgetId="${widgetId}"]`);
    if (widgetElement) {
      widgetElement.refresh();
    }
  }
  
  handleWidgetRemove(e) {
    const widgetId = e.detail.widgetId;
    this.widgets = this.widgets.filter(w => w.id !== widgetId);
    this.saveWidgets();
  }
  
  handleWidgetConfigure(e) {
    const widgetId = e.detail.widgetId;
    console.log('Configure widget:', widgetId);
    // TODO: Open configuration dialog for the widget
  }
  
  resetWidgets() {
    if (confirm('Reset widgets to default layout?')) {
      this.widgets = this.getDefaultWidgets();
      this.saveWidgets();
    }
  }
  
  saveWidgets() {
    storage.set('dashboardWidgets', this.widgets);
  }
}

customElements.define('widgets-view', WidgetsView);