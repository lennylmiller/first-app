import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared-styles.js';
import '../../components/lit/todo-lit.js';
import '../../components/polymer/todo-polymer.js';
import '../../components/raw/todo-raw.js';
import '../../components/lit-v1/todo-lit-v1.js';

export class TodosView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      
      .todos-container {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .todos-header {
        margin-bottom: 2rem;
      }
      
      .todos-title {
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
      }
      
      .todos-subtitle {
        color: var(--color-text-secondary);
        font-size: 1rem;
      }
      
      .tabs {
        display: flex;
        gap: 0.5rem;
        border-bottom: 2px solid var(--sidebar-border);
        margin-bottom: 2rem;
        overflow-x: auto;
        scrollbar-width: thin;
      }
      
      .tabs::-webkit-scrollbar {
        height: 4px;
      }
      
      .tabs::-webkit-scrollbar-thumb {
        background: var(--color-text-secondary);
        border-radius: 2px;
      }
      
      .tab {
        padding: 0.75rem 1.5rem;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        white-space: nowrap;
      }
      
      .tab:hover {
        color: var(--color-text-primary);
        background-color: var(--color-surface);
      }
      
      .tab.active {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
      }
      
      .tab-content {
        animation: fadeIn var(--transition-normal);
      }
      
      .component-info {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .component-info h3 {
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }
      
      .component-info p {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
      }
      
      .todo-wrapper {
        background-color: var(--color-background);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-md);
      }
      
      /* Responsive styles */
      @media (max-width: 767px) {
        .todos-container {
          padding: 0;
        }
        
        .todos-title {
          font-size: 1.5rem;
        }
        
        .tab {
          padding: 0.5rem 1rem;
        }
        
        .todo-wrapper {
          padding: 1rem;
        }
      }
    `
  ];
  
  static properties = {
    activeTab: { type: String, state: true },
    location: { type: Object }
  };
  
  constructor() {
    super();
    this.activeTab = 'lit';
    this.tabs = [
      {
        id: 'lit',
        label: 'Lit v3',
        component: 'todo-lit',
        description: 'Modern Lit 3 implementation with reactive properties and decorators'
      },
      {
        id: 'polymer',
        label: 'Polymer 3',
        component: 'todo-polymer',
        description: 'Polymer 3 implementation with two-way data binding'
      },
      {
        id: 'raw',
        label: 'Vanilla JS',
        component: 'todo-list-raw',
        description: 'Pure JavaScript Web Components with manual DOM manipulation'
      },
      {
        id: 'lit-v1',
        label: 'Lit v1',
        component: 'todo-lit-v1',
        description: 'Legacy lit-element 2.x implementation for compatibility'
      }
    ];
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Check if a specific variant was requested via route
    if (this.location && this.location.params && this.location.params.variant) {
      const variant = this.location.params.variant;
      const validTab = this.tabs.find(tab => tab.id === variant);
      if (validTab) {
        this.activeTab = variant;
      }
    }
  }
  
  render() {
    const activeTabInfo = this.tabs.find(tab => tab.id === this.activeTab);
    
    return html`
      <div class="todos-container">
        <div class="todos-header">
          <h1 class="todos-title">Todo Components Showcase</h1>
          <p class="todos-subtitle">
            Explore different Web Component implementations side by side
          </p>
        </div>
        
        <div class="tabs" role="tablist">
          ${this.tabs.map(tab => html`
            <button
              class="tab ${tab.id === this.activeTab ? 'active' : ''}"
              role="tab"
              aria-selected="${tab.id === this.activeTab}"
              @click="${() => this.setActiveTab(tab.id)}">
              ${tab.label}
            </button>
          `)}
        </div>
        
        <div class="tab-content" role="tabpanel">
          ${activeTabInfo ? html`
            <div class="component-info">
              <h3>${activeTabInfo.label} Implementation</h3>
              <p>${activeTabInfo.description}</p>
            </div>
          ` : ''}
          
          <div class="todo-wrapper">
            ${this.renderActiveComponent()}
          </div>
        </div>
      </div>
    `;
  }
  
  renderActiveComponent() {
    const activeTab = this.tabs.find(tab => tab.id === this.activeTab);
    if (!activeTab) return html`<p>Select a tab to view the component</p>`;
    
    // Dynamically create the component based on the active tab
    switch (activeTab.component) {
      case 'todo-lit':
        return html`<todo-lit></todo-lit>`;
      case 'todo-polymer':
        return html`<todo-polymer></todo-polymer>`;
      case 'todo-list-raw':
        return html`<todo-list-raw></todo-list-raw>`;
      case 'todo-lit-v1':
        return html`<todo-lit-v1></todo-lit-v1>`;
      default:
        return html`<p>Component not found</p>`;
    }
  }
  
  setActiveTab(tabId) {
    this.activeTab = tabId;
    
    // Update URL to reflect the selected tab
    const path = `/todos/${tabId}`;
    window.history.pushState({}, '', path);
    
    // Dispatch event for analytics or other tracking
    this.dispatchEvent(new CustomEvent('tab-changed', {
      detail: { tab: tabId },
      bubbles: true,
      composed: true
    }));
  }
  
  // Called by Vaadin Router
  onBeforeEnter(location) {
    this.location = location;
  }
}

customElements.define('todos-view', TodosView);