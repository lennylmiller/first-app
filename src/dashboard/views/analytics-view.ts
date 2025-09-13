import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';
import Chart, { ChartConfiguration, Chart as ChartType } from 'chart.js/auto';
import { storage } from '../services/storage-service.js';

interface StatData {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'info';
}

interface ActivityData {
  icon: string;
  text: string;
  time: string;
  type: string;
}

interface TodoStats {
  total: number;
  completed: number;
  inProgress: number;
  productivity: number;
}

@customElement('analytics-view')
export class AnalyticsView extends LitElement {
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

      .analytics-container {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      @media (max-width: 768px) {
        .analytics-container {
          padding: 1rem;
        }
      }

      @media (max-width: 480px) {
        .analytics-container {
          padding: 0.75rem;
        }
      }

      .analytics-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      @media (max-width: 640px) {
        .analytics-header {
          flex-direction: column;
          align-items: stretch;
        }
      }

      .date-range {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .date-range select {
        padding: 0.5rem 1rem;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--color-surface);
        color: var(--color-text-primary);
        font-size: 0.875rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      @media (max-width: 640px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }

      .stat-card {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
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

      .stat-icon.success {
        background-color: var(--color-success);
      }

      .stat-icon.warning {
        background-color: var(--color-warning);
      }

      .stat-icon.info {
        background-color: var(--color-info);
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

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      @media (max-width: 768px) {
        .charts-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }

      .chart-container {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
      }

      .chart-container.full-width {
        grid-column: 1 / -1;
      }

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .chart-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .chart-actions {
        display: flex;
        gap: 0.5rem;
      }

      .chart-action {
        padding: 0.25rem 0.5rem;
        background: none;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .chart-action:hover {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }

      .chart-action.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }

      .chart-canvas {
        position: relative;
        height: 300px;
      }

      .activity-section {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
      }

      .activity-feed {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
      }

      .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
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

      .top-performers {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
      }

      .performer-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 0;
      }

      .performer-rank {
        width: 24px;
        height: 24px;
        background-color: var(--color-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .performer-rank.gold {
        background-color: #FFD700;
      }

      .performer-rank.silver {
        background-color: #C0C0C0;
      }

      .performer-rank.bronze {
        background-color: #CD7F32;
      }

      .performer-info {
        flex: 1;
      }

      .performer-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
      }

      .performer-metric {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
      }

      .performer-score {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-primary);
      }

      /* Mobile styles */
      @media (max-width: 767px) {
        .analytics-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .charts-grid {
          grid-template-columns: 1fr;
        }

        .activity-section {
          grid-template-columns: 1fr;
        }

        .chart-canvas {
          height: 200px;
        }
      }
    `
  ];

  @state()
  private stats?: StatData[];

  @state()
  private activities?: ActivityData[];

  @state()
  private dateRange: string = '7days';

  @state()
  private chartType: 'line' | 'bar' = 'line';

  @state()
  private charts: Record<string, ChartType> = {};

  constructor() {
    super();
    this.loadAnalyticsData();
  }

  private loadAnalyticsData(): void {
    // Load or generate analytics data
    const storedData = storage.get<{stats: StatData[], activities: ActivityData[]}>('analyticsData', null);

    if (storedData) {
      this.stats = storedData.stats;
      this.activities = storedData.activities;
    } else {
      this.generateSampleData();
    }
  }

  private generateSampleData(): void {
    // Calculate real stats from todos
    const todos = this.getTodosStats();

    this.stats = [
      {
        title: 'Total Todos',
        value: todos.total,
        trend: '+12%',
        trendUp: true,
        icon: '📋',
        color: 'primary'
      },
      {
        title: 'Completed',
        value: todos.completed,
        trend: '+8%',
        trendUp: true,
        icon: '✅',
        color: 'success'
      },
      {
        title: 'In Progress',
        value: todos.inProgress,
        trend: '-3%',
        trendUp: false,
        icon: '⏳',
        color: 'warning'
      },
      {
        title: 'Productivity',
        value: `${todos.productivity}%`,
        trend: '+5%',
        trendUp: true,
        icon: '📈',
        color: 'info'
      }
    ];

    this.activities = [
      {
        icon: '✅',
        text: 'Completed "Implement dashboard"',
        time: '2 hours ago',
        type: 'completed'
      },
      {
        icon: '➕',
        text: 'Added "Create analytics view"',
        time: '5 hours ago',
        type: 'added'
      },
      {
        icon: '📝',
        text: 'Updated "Design review"',
        time: '1 day ago',
        type: 'updated'
      },
      {
        icon: '⏰',
        text: 'Started "Phase 3 implementation"',
        time: '2 days ago',
        type: 'started'
      },
      {
        icon: '🏆',
        text: 'Achieved 80% completion rate',
        time: '3 days ago',
        type: 'achievement'
      }
    ];

    // Save to storage
    storage.set('analyticsData', {
      stats: this.stats,
      activities: this.activities,
      timestamp: Date.now()
    });
  }

  private getTodosStats(): TodoStats {
    // Get real stats from all todo lists
    const litTodos = storage.get<any[]>('lit-todo-list') || [];
    const polymerTodos = storage.get<any[]>('polymer-todo-list') || [];
    const rawTodos = storage.get<any[]>('raw-todo-list') || [];
    const litV1Todos = storage.get<any[]>('lit-v1-todo-list') || [];

    const allTodos = [...litTodos, ...polymerTodos, ...rawTodos, ...litV1Todos];
    const completed = allTodos.filter(todo => todo.done || todo.completed).length;
    const total = allTodos.length;
    const inProgress = total - completed;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      productivity
    };
  }

  render() {
    return html`
      <div class="analytics-container">
        <div class="analytics-header">
          <h1>Analytics Dashboard</h1>
          <div class="date-range">
            <span>Date Range:</span>
            <select @change="${this.handleDateRangeChange}">
              <option value="7days" ?selected="${this.dateRange === '7days'}">Last 7 Days</option>
              <option value="30days" ?selected="${this.dateRange === '30days'}">Last 30 Days</option>
              <option value="90days" ?selected="${this.dateRange === '90days'}">Last 90 Days</option>
              <option value="year" ?selected="${this.dateRange === 'year'}">This Year</option>
            </select>
          </div>
        </div>

        <div class="stats-grid">
          ${this.stats?.map(stat => this.renderStatCard(stat))}
        </div>

        <div class="charts-grid">
          <div class="chart-container">
            <div class="chart-header">
              <h3 class="chart-title">Task Completion Trend</h3>
              <div class="chart-actions">
                <button
                  class="chart-action ${this.chartType === 'line' ? 'active' : ''}"
                  @click="${() => this.switchChart('line')}">
                  Line
                </button>
                <button
                  class="chart-action ${this.chartType === 'bar' ? 'active' : ''}"
                  @click="${() => this.switchChart('bar')}">
                  Bar
                </button>
              </div>
            </div>
            <div class="chart-canvas">
              <canvas id="trendChart"></canvas>
            </div>
          </div>

          <div class="chart-container">
            <div class="chart-header">
              <h3 class="chart-title">Category Distribution</h3>
            </div>
            <div class="chart-canvas">
              <canvas id="pieChart"></canvas>
            </div>
          </div>

          <div class="chart-container full-width">
            <div class="chart-header">
              <h3 class="chart-title">Weekly Activity Heatmap</h3>
            </div>
            <div class="chart-canvas">
              <canvas id="heatmapChart"></canvas>
            </div>
          </div>
        </div>

        <div class="activity-section">
          <div class="activity-feed">
            <div class="activity-header">
              <h2>Recent Activity</h2>
              <button class="btn btn-text" @click="${this.refreshActivities}">
                Refresh
              </button>
            </div>
            ${this.activities?.map(activity => this.renderActivityItem(activity))}
          </div>

          <div class="top-performers">
            <h2>Top Performers</h2>
            ${this.renderTopPerformers()}
          </div>
        </div>
      </div>
    `;
  }

  private renderStatCard(stat: StatData) {
    return html`
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">${stat.title}</span>
          <div class="stat-icon ${stat.color}">${stat.icon}</div>
        </div>
        <div class="stat-value">${stat.value}</div>
        <div class="stat-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}">
          <span>${stat.trendUp ? '↑' : '↓'}</span>
          <span>${stat.trend}</span>
        </div>
      </div>
    `;
  }

  private renderActivityItem(activity: ActivityData) {
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

  private renderTopPerformers() {
    const performers = [
      { rank: 1, name: 'Lit v3 Todos', metric: '95% completion', score: 95 },
      { rank: 2, name: 'Polymer Todos', metric: '88% completion', score: 88 },
      { rank: 3, name: 'Raw JS Todos', metric: '82% completion', score: 82 },
      { rank: 4, name: 'Lit v1 Todos', metric: '76% completion', score: 76 }
    ];

    return html`
      ${performers.map(performer => html`
        <div class="performer-item">
          <div class="performer-rank ${performer.rank === 1 ? 'gold' : performer.rank === 2 ? 'silver' : performer.rank === 3 ? 'bronze' : ''}">
            ${performer.rank}
          </div>
          <div class="performer-info">
            <div class="performer-name">${performer.name}</div>
            <div class="performer-metric">${performer.metric}</div>
          </div>
          <div class="performer-score">${performer.score}</div>
        </div>
      `)}
    `;
  }

  firstUpdated(): void {
    // Initialize charts after the component is rendered
    this.initCharts();
  }

  private initCharts(): void {
    // Create trend chart
    const trendCanvas = this.shadowRoot?.querySelector('#trendChart') as HTMLCanvasElement;
    if (trendCanvas) {
      this.createTrendChart(trendCanvas);
    }

    // Create pie chart
    const pieCanvas = this.shadowRoot?.querySelector('#pieChart') as HTMLCanvasElement;
    if (pieCanvas) {
      this.createPieChart(pieCanvas);
    }

    // Create heatmap chart
    const heatmapCanvas = this.shadowRoot?.querySelector('#heatmapChart') as HTMLCanvasElement;
    if (heatmapCanvas) {
      this.createHeatmapChart(heatmapCanvas);
    }
  }

  private createTrendChart(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.charts.trend) {
      this.charts.trend.destroy();
    }

    const config: ChartConfiguration = {
      type: this.chartType,
      data: {
        labels: this.getDateLabels(),
        datasets: [{
          label: 'Completed',
          data: [12, 19, 15, 25, 22, 30, 28],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }, {
          label: 'Added',
          data: [15, 12, 18, 14, 20, 16, 22],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.charts.trend = new Chart(ctx, config);
  }

  private createPieChart(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.charts.pie) {
      this.charts.pie.destroy();
    }

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Work', 'Personal', 'Shopping', 'Health', 'Other'],
        datasets: [{
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    };

    this.charts.pie = new Chart(ctx, config);
  }

  private createHeatmapChart(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.charts.heatmap) {
      this.charts.heatmap.destroy();
    }

    // Generate heatmap data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['Morning', 'Afternoon', 'Evening', 'Night'];

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: days,
        datasets: hours.map((hour, index) => ({
          label: hour,
          data: days.map(() => Math.floor(Math.random() * 10) + 1),
          backgroundColor: `rgba(${54 + index * 50}, ${162 - index * 30}, 235, ${0.3 + index * 0.2})`
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        }
      }
    };

    this.charts.heatmap = new Chart(ctx, config);
  }

  private getDateLabels(): string[] {
    const days: string[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    return days;
  }

  private handleDateRangeChange(e: Event): void {
    const target = e.target as HTMLSelectElement;
    this.dateRange = target.value;
    this.refreshData();
  }

  private switchChart(type: 'line' | 'bar'): void {
    this.chartType = type;
    const trendCanvas = this.shadowRoot?.querySelector('#trendChart') as HTMLCanvasElement;
    if (trendCanvas) {
      this.createTrendChart(trendCanvas);
    }
  }

  private refreshActivities(): void {
    // Add a new activity
    const newActivity: ActivityData = {
      icon: '🔄',
      text: 'Analytics data refreshed',
      time: 'Just now',
      type: 'system'
    };

    if (this.activities) {
      this.activities = [newActivity, ...this.activities.slice(0, 4)];
    } else {
      this.activities = [newActivity];
    }

    // Update storage
    storage.set('analyticsData', {
      stats: this.stats,
      activities: this.activities,
      timestamp: Date.now()
    });
  }

  private refreshData(): void {
    // Refresh all data based on date range
    this.loadAnalyticsData();
    this.initCharts();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    // Clean up charts when component is removed
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
  }
}