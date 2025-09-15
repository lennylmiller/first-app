import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../components/lit/pac-man.js';

@customElement('pac-man-widget')
export class PacManWidget extends LitElement {
  @property({ type: String })
  widgetId = '';

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .pac-man-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 1rem;
      box-sizing: border-box;
    }

    .widget-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 1rem;
    }

    .widget-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--primary-color, #333);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .test-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .test-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .test-button:active {
      transform: translateY(0);
    }

    pac-man {
      width: 100%;
      max-width: 600px;
    }

    .instructions {
      font-size: 0.8rem;
      color: var(--secondary-text-color, #666);
      text-align: center;
      margin-top: 0.5rem;
    }
  `;

  private _startPacMan() {
    const pacManElement = this.shadowRoot?.querySelector('pac-man') as any;
    if (pacManElement && pacManElement.startSavingAnimation) {
      pacManElement.startSavingAnimation();
    }
  }

  render() {
    return html`
      <div class="pac-man-container">
        <div class="widget-header">
          <div class="widget-title">
            <span>👾</span>
            Pac-Man Game
          </div>
          <button class="test-button" @click=${this._startPacMan}>
            Start Game
          </button>
        </div>
        
        <pac-man 
          chomp-time="8" 
          power-pellet="red" 
          normal-pellet="green"
          background-color="white">
        </pac-man>
        
        <div class="instructions">
          Click "Start Game" or press Alt+S to begin!
        </div>
      </div>
    `;
  }
}