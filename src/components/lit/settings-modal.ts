// Lit 3 Settings Modal Component - TypeScript
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('settings-modal-lit')
export class SettingsModalLit extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
    .modal-overlay.show {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .modal-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
    }
    .modal-close:hover {
      color: #333;
    }
    .settings-option {
      margin: 15px 0;
    }
    .clear-storage-btn {
      width: 100%;
      padding: 10px;
      background-color: #ff3b30;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }
    .clear-storage-btn:hover {
      background-color: #dc2626;
    }
  `;

  @state()
  private isVisible = false;

  show(): void {
    this.isVisible = true;
    this.dispatchEvent(new CustomEvent('modal-opened', {
      bubbles: true,
      composed: true
    }));
  }

  hide(): void {
    this.isVisible = false;
    this.dispatchEvent(new CustomEvent('modal-closed', {
      bubbles: true,
      composed: true
    }));
  }

  private _handleModalClick(e: MouseEvent): void {
    const target = e.target as Element;
    if (target.classList.contains('modal-overlay')) {
      this.hide();
    }
  }

  private _handleClearStorage(): void {
    this.dispatchEvent(new CustomEvent('clear-storage', {
      bubbles: true,
      composed: true
    }));
  }

  render(): TemplateResult {
    return html`
      <div class="modal-overlay ${this.isVisible ? 'show' : ''}" @click=${this._handleModalClick}>
        <div class="modal-content">
          <div class="modal-header">
            <span class="modal-title">Settings</span>
            <button class="modal-close" @click=${this.hide} aria-label="Close">×</button>
          </div>
          <div class="settings-option">
            <button class="clear-storage-btn" @click=${this._handleClearStorage}>🗑️ Clear All Todos</button>
          </div>
        </div>
      </div>
    `;
  }
}