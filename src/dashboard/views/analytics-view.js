import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';

export class AnalyticsView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      
      .analytics-container {
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      
      .stat-card {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
      }
      
      .stat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      
      .stat-title {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        font-weight: 500;
      }
      
      .stat-icon {
        width: 40px;
        height: 40px;
        background-color: var(--color-primary);
        color: white;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
      }
      
      .stat-value {
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
      }
      
      .stat-trend {
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      
      .trend-up {
        color: var(--color-success);
      }
      
      .trend-down {
        color: var(--color-error);
      }
      
      .chart-container {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
      }
      
      .activity-feed {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
      }
      
      .activity-item {
        display: flex;
        gap: 1rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--sidebar-border);
      }
      
      .activity-item:last-child {
        border-bottom: none;
      }
      
      .activity-icon {
        width: 32px;
        height: 32px;
        background-color: var(--color-surface-variant);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .activity-content {
        flex: 1;
      }
      
      .activity-text {
        font-size: 0.875rem;
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
      }
      
      .activity-time {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
      }
    `
  ];
  
  static properties = {
    stats: { type: Array, state: true },
    activities: { type: Array, state: true }
  };
  
  constructor() {
    super();
    this.stats = [
      {
        title: 'Total Todos',
        value: 42,
        trend: '+12%',
        trendUp: true,
        icon: '✓'
      },
      {
        title: 'Completed',
        value: 28,
        trend: '+8%',
        trendUp: true,
        icon: '✅'
      },
      {
        title: 'In Progress',
        value: 10,
        trend: '-3%',
        trendUp: false,
        icon: '⏳'
      },
      {
        title: 'Overdue',
        value: 4,
        trend: '+2%',
        trendUp: true,
        icon: '⚠️'
      }
    ];
    
    this.activities = [
      {
        icon: '✅',
        text: 'Completed "Fix login bug"',
        time: '2 hours ago'
      },
      {
        icon: '➕',
        text: 'Added "Implement dashboard"',
        time: '5 hours ago'
      },
      {
        icon: '📝',
        text: 'Updated "Design review"',
        time: '1 day ago'
      },
      {
        icon: '🗑️',
        text: 'Deleted "Old task"',
        time: '2 days ago'
      }
    ];
  }
  
  render() {
    return html`
      <div class="analytics-container">
        <h1>Analytics Dashboard</h1>
        
        <div class="stats-grid">
          ${this.stats.map(stat => this.renderStatCard(stat))}
        </div>
        
        <div class="chart-container">
          <p>📊 Chart visualization will be implemented here</p>
        </div>
        
        <div class="activity-feed">
          <h2>Recent Activity</h2>
          ${this.activities.map(activity => this.renderActivityItem(activity))}
        </div>
      </div>
    `;
  }
  
  renderStatCard(stat) {
    return html`
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">${stat.title}</span>
          <div class="stat-icon">${stat.icon}</div>
        </div>
        <div class="stat-value">${stat.value}</div>
        <div class="stat-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}">
          <span>${stat.trendUp ? '↑' : '↓'}</span>
          <span>${stat.trend}</span>
        </div>
      </div>
    `;
  }
  
  renderActivityItem(activity) {
    return html`
      <div class="activity-item">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
          <div class="activity-text">${activity.text}</div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('analytics-view', AnalyticsView);