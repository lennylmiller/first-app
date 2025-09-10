// Lit v1 (lit-element 2.x and lit-html 1.x) Component
import { LitElement, html, css } from 'lit-element';

export class CounterLitV1 extends LitElement {
  static get properties() {
    return {
      count: { type: Number },
      step: { type: Number }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        max-width: 400px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 20px;
        margin: 20px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }

      h1 {
        font-size: 24px;
        margin-top: 0;
        text-align: center;
      }

      .counter-display {
        text-align: center;
        font-size: 48px;
        font-weight: bold;
        margin: 20px 0;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      }

      .controls {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 20px 0;
      }

      button {
        padding: 10px 20px;
        font-size: 18px;
        border: none;
        border-radius: 4px;
        background: white;
        color: #764ba2;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        font-weight: bold;
      }

      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      button:active {
        transform: translateY(0);
      }

      .step-control {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(255,255,255,0.3);
      }

      .step-control label {
        font-size: 14px;
      }

      .step-control select {
        padding: 5px 10px;
        border-radius: 4px;
        border: none;
        background: white;
        color: #764ba2;
        font-weight: bold;
        cursor: pointer;
      }

      .badge {
        display: inline-block;
        background: rgba(255,255,255,0.2);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin-left: 10px;
      }
    `;
  }

  constructor() {
    super();
    this.count = 0;
    this.step = 1;
  }

  increment() {
    this.count += this.step;
  }

  decrement() {
    this.count -= this.step;
  }

  reset() {
    this.count = 0;
  }

  handleStepChange(e) {
    this.step = parseInt(e.target.value, 10);
  }

  render() {
    return html`
      <h1>
        Lit v1 Counter
        <span class="badge">lit-element 2.x</span>
      </h1>
      
      <div class="counter-display">
        ${this.count}
      </div>
      
      <div class="controls">
        <button @click=${this.decrement}>
          - ${this.step}
        </button>
        <button @click=${this.reset}>
          Reset
        </button>
        <button @click=${this.increment}>
          + ${this.step}
        </button>
      </div>
      
      <div class="step-control">
        <label for="step-select">Step:</label>
        <select 
          id="step-select" 
          @change=${this.handleStepChange}
          .value=${String(this.step)}
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="100">100</option>
        </select>
      </div>
    `;
  }
}

customElements.define('counter-lit-v1', CounterLitV1);