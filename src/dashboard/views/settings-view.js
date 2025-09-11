import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';
import { themeService } from '../services/theme-service.js';

export class SettingsView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      
      .settings-container {
        max-width: 800px;
        margin: 0 auto;
      }
      
      .settings-section {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--color-text-primary);
      }
      
      .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--sidebar-border);
      }
      
      .setting-item:last-child {
        border-bottom: none;
      }
      
      .setting-label {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      
      .setting-name {
        font-weight: 500;
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
      }
      
      .setting-description {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
      
      .theme-options {
        display: flex;
        gap: 0.5rem;
      }
      
      .theme-button {
        padding: 0.5rem 1rem;
        border: 2px solid var(--input-border);
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all var(--transition-fast);
      }
      
      .theme-button.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }
    `
  ];
  
  static properties = {
    currentTheme: { type: String, state: true }
  };
  
  constructor() {
    super();
    this.currentTheme = themeService.getCurrentTheme();
  }
  
  render() {
    return html`
      <div class="settings-container">
        <h1>Settings</h1>
        
        <div class="settings-section">
          <h2 class="section-title">Appearance</h2>
          
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Theme</span>
              <span class="setting-description">Choose your preferred color scheme</span>
            </div>
            <div class="theme-options">
              <button 
                class="theme-button ${this.currentTheme === 'light' ? 'active' : ''}"
                @click="${() => this.setTheme('light')}">
                ☀️ Light
              </button>
              <button 
                class="theme-button ${this.currentTheme === 'dark' ? 'active' : ''}"
                @click="${() => this.setTheme('dark')}">
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
        
        <div class="settings-section">
          <h2 class="section-title">Preferences</h2>
          <p class="setting-description">More settings coming soon...</p>
        </div>
      </div>
    `;
  }
  
  setTheme(theme) {
    this.currentTheme = theme;
    themeService.applyTheme(theme);
  }
}

customElements.define('settings-view', SettingsView);