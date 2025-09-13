import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { themeService } from '../services/theme-service.js';
import '../components/theme-editor.js';

@customElement('settings-view')
export class SettingsView extends LitElement {
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

      .settings-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      @media (max-width: 768px) {
        .settings-container {
          padding: 1rem;
        }
      }

      @media (max-width: 480px) {
        .settings-container {
          padding: 0.75rem;
        }
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
        flex-wrap: wrap;
        gap: 1rem;
      }

      @media (max-width: 640px) {
        .setting-item {
          flex-direction: column;
          align-items: stretch;
        }
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

      .theme-editor-button {
        padding: 0.5rem 1rem;
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 0.875rem;
        transition: background-color var(--transition-fast);
      }

      .theme-editor-button:hover {
        background-color: var(--color-primary-dark);
      }

      .shortcuts-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .shortcut-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem;
        background-color: var(--color-background);
        border-radius: var(--border-radius);
      }

      .shortcut-keys {
        display: flex;
        gap: 0.25rem;
      }

      .key {
        padding: 0.25rem 0.5rem;
        background-color: var(--sidebar-hover);
        border: 1px solid var(--input-border);
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.875rem;
      }
    `
  ];

  @state()
  private currentTheme: string = themeService.getCurrentTheme();

  @state()
  private showThemeEditor: boolean = false;

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

          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Custom Themes</span>
              <span class="setting-description">Create and manage custom color themes</span>
            </div>
            <button
              class="theme-editor-button"
              @click="${() => this.showThemeEditor = true}">
              🎨 Open Theme Editor
            </button>
          </div>
        </div>

        <div class="settings-section">
          <h2 class="section-title">Keyboard Shortcuts</h2>
          <div class="shortcuts-section">
            <div class="shortcut-item">
              <div class="setting-label">
                <span class="setting-name">Search</span>
                <span class="setting-description">Open global search</span>
              </div>
              <div class="shortcut-keys">
                <span class="key">Cmd</span>
                <span class="key">K</span>
              </div>
            </div>

            <div class="shortcut-item">
              <div class="setting-label">
                <span class="setting-name">Toggle Sidebar</span>
                <span class="setting-description">Show/hide navigation sidebar</span>
              </div>
              <div class="shortcut-keys">
                <span class="key">Cmd</span>
                <span class="key">B</span>
              </div>
            </div>

            <div class="shortcut-item">
              <div class="setting-label">
                <span class="setting-name">Toggle Theme</span>
                <span class="setting-description">Switch between light and dark mode</span>
              </div>
              <div class="shortcut-keys">
                <span class="key">Cmd</span>
                <span class="key">Shift</span>
                <span class="key">T</span>
              </div>
            </div>

            <div class="shortcut-item">
              <div class="setting-label">
                <span class="setting-name">Navigation</span>
                <span class="setting-description">Quick navigation with Alt+Number</span>
              </div>
              <div class="shortcut-keys">
                <span class="key">Alt</span>
                <span class="key">1-9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${this.showThemeEditor ? html`
        <theme-editor
          @close="${() => this.showThemeEditor = false}"
          @theme-applied="${() => this.currentTheme = themeService.getCurrentTheme()}">
        </theme-editor>
      ` : ''}
    `;
  }

  private setTheme(theme: string): void {
    this.currentTheme = theme;
    themeService.applyTheme(theme);
  }
}