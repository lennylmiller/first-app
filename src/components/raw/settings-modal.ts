// Raw Web Component - Settings Modal with TypeScript
const template: HTMLTemplateElement = document.createElement('template');
template.innerHTML = `
  <style>
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
      animation: fadeIn 0.2s ease-out;
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
      animation: slideUp 0.3s ease-out;
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
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  </style>
  <div class="modal-overlay" id="settings-modal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-title">Settings</span>
        <button class="modal-close" id="modal-close" aria-label="Close">×</button>
      </div>
      <div class="settings-option">
        <button class="clear-storage-btn" id="clear-storage-btn">🗑️ Clear All Todos</button>
      </div>
    </div>
  </div>
`;

export class SettingsModalRaw extends HTMLElement {
  private _isVisible: boolean;
  private _escapeHandler: (e: KeyboardEvent) => void;
  declare shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._isVisible = false;

    // Bind the escape handler to maintain proper 'this' context
    this._escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this._isVisible) {
        this.hide();
      }
    };
  }

  connectedCallback(): void {
    const modal = this.shadowRoot.querySelector('#settings-modal') as HTMLDivElement;

    // Close button
    const modalClose = this.shadowRoot.querySelector('#modal-close') as HTMLButtonElement;
    modalClose.addEventListener('click', () => this.hide());

    // Clear storage button
    const clearStorageBtn = this.shadowRoot.querySelector('#clear-storage-btn') as HTMLButtonElement;
    clearStorageBtn.addEventListener('click', () => {
      const event = new CustomEvent('clear-storage', {
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    });

    // Click outside modal to close
    modal.addEventListener('click', (e: Event) => {
      if (e.target === modal) {
        this.hide();
      }
    });

    // Escape key to close modal
    document.addEventListener('keydown', this._escapeHandler);
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this._escapeHandler);
  }

  show(): void {
    const modal = this.shadowRoot.querySelector('#settings-modal') as HTMLDivElement;
    modal.classList.add('show');
    this._isVisible = true;

    const event = new CustomEvent('modal-opened', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  hide(): void {
    const modal = this.shadowRoot.querySelector('#settings-modal') as HTMLDivElement;
    modal.classList.remove('show');
    this._isVisible = false;

    const event = new CustomEvent('modal-closed', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  get isVisible(): boolean {
    return this._isVisible;
  }
}

customElements.define('settings-modal-raw', SettingsModalRaw);