// Raw Web Component - Settings Modal
const template = document.createElement('template');
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
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._isVisible = false;
  }
  
  connectedCallback() {
    const modal = this.shadowRoot.querySelector('#settings-modal');
    
    // Close button
    this.shadowRoot.querySelector('#modal-close').addEventListener('click', () => this.hide());
    
    // Clear storage button
    this.shadowRoot.querySelector('#clear-storage-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('clear-storage', {
        bubbles: true,
        composed: true
      }));
    });
    
    // Click outside modal to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hide();
      }
    });
    
    // Escape key to close modal
    this._escapeHandler = (e) => {
      if (e.key === 'Escape' && this._isVisible) {
        this.hide();
      }
    };
    document.addEventListener('keydown', this._escapeHandler);
  }
  
  disconnectedCallback() {
    document.removeEventListener('keydown', this._escapeHandler);
  }
  
  show() {
    const modal = this.shadowRoot.querySelector('#settings-modal');
    modal.classList.add('show');
    this._isVisible = true;
    
    this.dispatchEvent(new CustomEvent('modal-opened', {
      bubbles: true,
      composed: true
    }));
  }
  
  hide() {
    const modal = this.shadowRoot.querySelector('#settings-modal');
    modal.classList.remove('show');
    this._isVisible = false;
    
    this.dispatchEvent(new CustomEvent('modal-closed', {
      bubbles: true,
      composed: true
    }));
  }
  
  get isVisible() {
    return this._isVisible;
  }
}

customElements.define('settings-modal-raw', SettingsModalRaw);