import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';

export class WidgetsView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      
      .widgets-container {
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .widgets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      
      .widget {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
      }
      
      .widget:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
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
      }
      
      .widget-menu {
        color: var(--color-text-secondary);
        cursor: pointer;
      }
      
      .widget-content {
        color: var(--color-text-secondary);
      }
      
      .progress-widget {
        grid-column: span 2;
      }
      
      .progress-bars {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .progress-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .progress-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
      }
      
      .progress-bar {
        height: 8px;
        background-color: var(--color-surface-variant);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .progress-fill {
        height: 100%;
        background-color: var(--color-primary);
        transition: width var(--transition-normal);
      }
      
      .quick-actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
      
      .action-button {
        padding: 0.75rem;
        text-align: center;
        font-size: 0.875rem;
      }
      
      .calendar-widget {
        text-align: center;
      }
      
      .calendar-date {
        font-size: 3rem;
        font-weight: bold;
        color: var(--color-primary);
        margin-bottom: 0.5rem;
      }
      
      .calendar-month {
        font-size: 1.25rem;
        color: var(--color-text-primary);
      }
      
      @media (max-width: 767px) {
        .progress-widget {
          grid-column: span 1;
        }
      }
    `
  ];
  
  static properties = {
    widgets: { type: Array, state: true }
  };
  
  constructor() {
    super();
    const now = new Date();
    this.currentDate = now.getDate();
    this.currentMonth = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  
  render() {
    return html`
      <div class="widgets-container">
        <h1>Dashboard Widgets</h1>
        
        <div class="widgets-grid">
          <!-- Calendar Widget -->
          <div class="widget calendar-widget">
            <div class="widget-header">
              <h3 class="widget-title">Calendar</h3>
              <span class="widget-menu">⋯</span>
            </div>
            <div class="widget-content">
              <div class="calendar-date">${this.currentDate}</div>
              <div class="calendar-month">${this.currentMonth}</div>
            </div>
          </div>
          
          <!-- Quick Actions Widget -->
          <div class="widget">
            <div class="widget-header">
              <h3 class="widget-title">Quick Actions</h3>
              <span class="widget-menu">⋯</span>
            </div>
            <div class="widget-content quick-actions">
              <button class="action-button">➕ New Todo</button>
              <button class="action-button">📊 View Stats</button>
              <button class="action-button">⚙️ Settings</button>
              <button class="action-button">👤 Profile</button>
            </div>
          </div>
          
          <!-- Progress Widget -->
          <div class="widget progress-widget">
            <div class="widget-header">
              <h3 class="widget-title">Project Progress</h3>
              <span class="widget-menu">⋯</span>
            </div>
            <div class="widget-content">
              <div class="progress-bars">
                ${this.renderProgressBar('Frontend Development', 75)}
                ${this.renderProgressBar('Backend API', 60)}
                ${this.renderProgressBar('Testing', 40)}
                ${this.renderProgressBar('Documentation', 25)}
              </div>
            </div>
          </div>
          
          <!-- Stats Widget -->
          <div class="widget">
            <div class="widget-header">
              <h3 class="widget-title">Weekly Stats</h3>
              <span class="widget-menu">⋯</span>
            </div>
            <div class="widget-content">
              <p>✅ Completed: 12 tasks</p>
              <p>⏳ In Progress: 5 tasks</p>
              <p>📅 Scheduled: 8 tasks</p>
              <p>⏰ Average time: 2.5 hours</p>
            </div>
          </div>
          
          <!-- Team Widget -->
          <div class="widget">
            <div class="widget-header">
              <h3 class="widget-title">Team Activity</h3>
              <span class="widget-menu">⋯</span>
            </div>
            <div class="widget-content">
              <p>👤 John: Working on dashboard</p>
              <p>👤 Sarah: Reviewing PRs</p>
              <p>👤 Mike: Testing features</p>
              <p>👤 Lisa: Writing documentation</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  renderProgressBar(label, percentage) {
    return html`
      <div class="progress-item">
        <div class="progress-label">
          <span>${label}</span>
          <span>${percentage}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('widgets-view', WidgetsView);