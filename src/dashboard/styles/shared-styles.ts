import { css, CSSResult } from 'lit';

export const sharedStyles: CSSResult = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  :host {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.5;
  }
  
  /* Layout utilities */
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  
  .responsive-container {
    width: 100%;
    max-width: 100%;
    padding: 1.5rem;
    margin: 0 auto;
    overflow-x: auto;
  }
  
  @media (max-width: 768px) {
    .responsive-container {
      padding: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .responsive-container {
      padding: 0.75rem;
    }
  }
  
  .flex {
    display: flex;
  }
  
  .flex-column {
    display: flex;
    flex-direction: column;
  }
  
  .flex-1 {
    flex: 1;
  }
  
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  /* Spacing utilities */
  .p-0 { padding: 0; }
  .p-1 { padding: 0.25rem; }
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .p-5 { padding: 1.25rem; }
  .p-6 { padding: 1.5rem; }
  .p-8 { padding: 2rem; }
  
  .m-0 { margin: 0; }
  .m-1 { margin: 0.25rem; }
  .m-2 { margin: 0.5rem; }
  .m-3 { margin: 0.75rem; }
  .m-4 { margin: 1rem; }
  
  .gap-1 { gap: 0.25rem; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: 1rem; }
  
  /* Typography */
  h1 {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-text-primary);
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-text-primary);
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-text-primary);
  }
  
  p {
    color: var(--color-text-secondary);
  }
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  
  a:hover {
    color: var(--color-primary-dark);
  }
  
  /* Buttons */
  button {
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    background-color: var(--button-bg);
    color: var(--button-text);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  button:hover:not(:disabled) {
    background-color: var(--button-hover);
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  button.ghost {
    background-color: transparent;
    color: var(--color-text-primary);
  }
  
  button.ghost:hover {
    background-color: var(--color-surface);
  }
  
  /* Inputs */
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: 0.875rem;
    padding: 0.5rem;
    border: 1px solid var(--input-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    color: var(--color-text-primary);
    transition: all var(--transition-fast);
  }
  
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--input-focus);
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
  
  /* Cards */
  .card {
    background-color: var(--color-surface);
    border-radius: var(--border-radius-lg);
    padding: 1rem;
    box-shadow: var(--shadow-sm);
  }
  
  /* Utilities */
  .hidden {
    display: none !important;
  }
  
  .visible {
    visibility: visible;
  }
  
  .invisible {
    visibility: hidden;
  }
  
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  .fade-in {
    animation: fadeIn var(--transition-normal);
  }
  
  .slide-in-left {
    animation: slideInLeft var(--transition-normal);
  }
  
  .slide-in-right {
    animation: slideInRight var(--transition-normal);
  }
`;