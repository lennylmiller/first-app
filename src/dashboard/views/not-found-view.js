import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';

export class NotFoundView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      
      .not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;
        padding: 2rem;
      }
      
      .error-code {
        font-size: 6rem;
        font-weight: bold;
        color: var(--color-primary);
        margin-bottom: 1rem;
      }
      
      .error-message {
        font-size: 1.5rem;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
      }
      
      .error-description {
        font-size: 1rem;
        color: var(--color-text-secondary);
        margin-bottom: 2rem;
      }
      
      .back-button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
      }
    `
  ];
  
  render() {
    return html`
      <div class="not-found-container">
        <div class="error-code">404</div>
        <h1 class="error-message">Page Not Found</h1>
        <p class="error-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button class="back-button" @click="${this.goHome}">
          Go to Dashboard
        </button>
      </div>
    `;
  }
  
  goHome() {
    window.location.href = '/';
  }
}

customElements.define('not-found-view', NotFoundView);