import { LitElement, html, css } from 'lit';

export class ShowcaseView extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: white;
      font-size: 3rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.25rem;
      text-align: center;
      margin-bottom: 3rem;
      font-weight: 300;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .feature-icon.todos {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .feature-icon.analytics {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }

    .feature-icon.widgets {
      background: linear-gradient(135deg, #4facfe, #00f2fe);
    }

    .feature-icon.profile {
      background: linear-gradient(135deg, #43e97b, #38f9d7);
    }

    .feature-icon.settings {
      background: linear-gradient(135deg, #fa709a, #fee140);
    }

    .feature-icon.components {
      background: linear-gradient(135deg, #30cfd0, #330867);
    }

    .feature-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }

    .feature-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .feature-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: gap 0.3s ease;
    }

    .feature-link:hover {
      gap: 1rem;
    }

    .stats-section {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 3rem;
      backdrop-filter: blur(10px);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 2rem;
      text-align: center;
    }

    .stat-item {
      color: white;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
    }

    .quick-actions {
      text-align: center;
      margin-top: 3rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      border: none;
      font-size: 1rem;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      background: #f0f0f0;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  static properties = {
    userName: { type: String }
  };

  constructor() {
    super();
    this.userName = 'User';
  }

  connectedCallback() {
    super.connectedCallback();
    // Get user name from localStorage if available
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      this.userName = savedName;
    }
  }

  navigateTo(path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('vaadin-router-go', {
      detail: { pathname: path }
    }));
  }

  render() {
    return html`
      <div class="container">
        <h1>Welcome to Your Dashboard</h1>
        <p class="subtitle">Everything you need to manage your tasks and stay productive</p>

        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">5</div>
              <div class="stat-label">Active Tasks</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">12</div>
              <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">3</div>
              <div class="stat-label">Projects</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">89%</div>
              <div class="stat-label">Productivity</div>
            </div>
          </div>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon todos">📋</div>
            <h2 class="feature-title">Todo Lists</h2>
            <p class="feature-description">
              Manage your tasks with multiple Web Component implementations. 
              Choose from Raw, Polymer, Lit, or Lit v1 components.
            </p>
            <a href="/todos" class="feature-link" @click=${(e) => {
              e.preventDefault();
              this.navigateTo('/todos');
            }}>
              View Todos →
            </a>
          </div>

          <div class="feature-card">
            <div class="feature-icon analytics">📊</div>
            <h2 class="feature-title">Analytics</h2>
            <p class="feature-description">
              Track your productivity with detailed analytics and insights. 
              Visualize your progress over time.
            </p>
            <a href="/analytics" class="feature-link" @click=${(e) => {
              e.preventDefault();
              this.navigateTo('/analytics');
            }}>
              View Analytics →
            </a>
          </div>

          <div class="feature-card">
            <div class="feature-icon widgets">🎨</div>
            <h2 class="feature-title">Widgets</h2>
            <p class="feature-description">
              Customize your dashboard with interactive widgets. 
              Add counters, timers, and more.
            </p>
            <a href="/widgets" class="feature-link" @click=${(e) => {
              e.preventDefault();
              this.navigateTo('/widgets');
            }}>
              Explore Widgets →
            </a>
          </div>

          <div class="feature-card">
            <div class="feature-icon profile">👤</div>
            <h2 class="feature-title">Profile</h2>
            <p class="feature-description">
              Manage your personal information and preferences. 
              Customize your dashboard experience.
            </p>
            <a href="/profile" class="feature-link" @click=${(e) => {
              e.preventDefault();
              this.navigateTo('/profile');
            }}>
              Edit Profile →
            </a>
          </div>

          <div class="feature-card">
            <div class="feature-icon settings">⚙️</div>
            <h2 class="feature-title">Settings</h2>
            <p class="feature-description">
              Configure your dashboard settings, themes, and notifications. 
              Make it work the way you want.
            </p>
            <a href="/settings" class="feature-link" @click=${(e) => {
              e.preventDefault();
              this.navigateTo('/settings');
            }}>
              Manage Settings →
            </a>
          </div>

          <div class="feature-card">
            <div class="feature-icon components">🧩</div>
            <h2 class="feature-title">Component Showcase</h2>
            <p class="feature-description">
              Explore the original Web Components showcase with Raw, Polymer, 
              and Lit implementations.
            </p>
            <a href="/showcase.html" class="feature-link">
              View Showcase →
            </a>
          </div>
        </div>

        <div class="quick-actions">
          <div class="action-buttons">
            <button class="btn btn-primary" @click=${() => this.navigateTo('/todos')}>
              <span>📝</span>
              <span>Quick Add Task</span>
            </button>
            <button class="btn btn-secondary" @click=${() => this.navigateTo('/analytics')}>
              <span>📈</span>
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('showcase-view', ShowcaseView);