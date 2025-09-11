import { fixture, expect, html } from '@open-wc/testing';
import '../src/dashboard/components/dashboard-widget.js';

describe('DashboardWidget', () => {
  describe('Rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`
        <dashboard-widget></dashboard-widget>
      `);
      
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });
    
    it('renders with custom title and icon', async () => {
      const el = await fixture(html`
        <dashboard-widget
          title="Test Widget"
          icon="📊">
        </dashboard-widget>
      `);
      
      const title = el.shadowRoot.querySelector('.widget-title');
      expect(title.textContent).to.include('Test Widget');
      expect(title.textContent).to.include('📊');
    });
    
    it('applies correct widget type class', async () => {
      const el = await fixture(html`
        <dashboard-widget type="chart"></dashboard-widget>
      `);
      
      const widget = el.shadowRoot.querySelector('.widget');
      expect(widget.classList.contains('type-chart')).to.be.true;
    });
    
    it('applies correct widget size class', async () => {
      const el = await fixture(html`
        <dashboard-widget size="large"></dashboard-widget>
      `);
      
      const widget = el.shadowRoot.querySelector('.widget');
      expect(widget.classList.contains('size-large')).to.be.true;
    });
  });
  
  describe('Actions', () => {
    it('shows refresh button when refreshable', async () => {
      const el = await fixture(html`
        <dashboard-widget refreshable></dashboard-widget>
      `);
      
      const refreshBtn = el.shadowRoot.querySelector('[title="Refresh"]');
      expect(refreshBtn).to.exist;
    });
    
    it('shows collapse button when collapsible', async () => {
      const el = await fixture(html`
        <dashboard-widget collapsible></dashboard-widget>
      `);
      
      const collapseBtn = el.shadowRoot.querySelector('[title*="Collapse"]');
      expect(collapseBtn).to.exist;
    });
    
    it('shows configure button when configurable', async () => {
      const el = await fixture(html`
        <dashboard-widget configurable></dashboard-widget>
      `);
      
      const configBtn = el.shadowRoot.querySelector('[title="Configure"]');
      expect(configBtn).to.exist;
    });
    
    it('shows remove button when removable', async () => {
      const el = await fixture(html`
        <dashboard-widget removable></dashboard-widget>
      `);
      
      const removeBtn = el.shadowRoot.querySelector('[title="Remove"]');
      expect(removeBtn).to.exist;
    });
    
    it('hides actions when properties are false', async () => {
      const el = await fixture(html`
        <dashboard-widget
          .refreshable="${false}"
          .collapsible="${false}"
          .configurable="${false}"
          .removable="${false}">
        </dashboard-widget>
      `);
      
      const actions = el.shadowRoot.querySelectorAll('.widget-action');
      expect(actions.length).to.equal(0);
    });
  });
  
  describe('Collapse/Expand', () => {
    it('toggles collapsed state on button click', async () => {
      const el = await fixture(html`
        <dashboard-widget collapsible></dashboard-widget>
      `);
      
      expect(el.collapsed).to.be.false;
      
      const collapseBtn = el.shadowRoot.querySelector('[title*="Collapse"]');
      collapseBtn.click();
      
      await el.updateComplete;
      expect(el.collapsed).to.be.true;
      
      // Content should be hidden
      const content = el.shadowRoot.querySelector('.widget-content');
      expect(content).to.not.exist;
    });
    
    it('changes button icon when collapsed', async () => {
      const el = await fixture(html`
        <dashboard-widget collapsible collapsed></dashboard-widget>
      `);
      
      const collapseBtn = el.shadowRoot.querySelector('[title*="Expand"]');
      expect(collapseBtn).to.exist;
      expect(collapseBtn.textContent).to.include('▼');
    });
  });
  
  describe('Events', () => {
    it('fires widget-refresh event', async () => {
      const el = await fixture(html`
        <dashboard-widget
          widget-id="test-widget"
          refreshable>
        </dashboard-widget>
      `);
      
      let eventFired = false;
      let eventDetail = null;
      
      el.addEventListener('widget-refresh', (e) => {
        eventFired = true;
        eventDetail = e.detail;
      });
      
      const refreshBtn = el.shadowRoot.querySelector('[title="Refresh"]');
      refreshBtn.click();
      
      expect(eventFired).to.be.true;
      expect(eventDetail.widgetId).to.equal('test-widget');
    });
    
    it('fires widget-remove event with confirmation', async () => {
      const el = await fixture(html`
        <dashboard-widget
          widget-id="test-widget"
          title="Test Widget"
          removable>
        </dashboard-widget>
      `);
      
      let eventFired = false;
      
      el.addEventListener('widget-remove', () => {
        eventFired = true;
      });
      
      // Mock confirm dialog
      const originalConfirm = window.confirm;
      window.confirm = () => true;
      
      const removeBtn = el.shadowRoot.querySelector('[title="Remove"]');
      removeBtn.click();
      
      expect(eventFired).to.be.true;
      
      // Restore original confirm
      window.confirm = originalConfirm;
    });
    
    it('does not fire widget-remove event when cancelled', async () => {
      const el = await fixture(html`
        <dashboard-widget
          widget-id="test-widget"
          removable>
        </dashboard-widget>
      `);
      
      let eventFired = false;
      
      el.addEventListener('widget-remove', () => {
        eventFired = true;
      });
      
      // Mock confirm dialog to return false
      const originalConfirm = window.confirm;
      window.confirm = () => false;
      
      const removeBtn = el.shadowRoot.querySelector('[title="Remove"]');
      removeBtn.click();
      
      expect(eventFired).to.be.false;
      
      // Restore original confirm
      window.confirm = originalConfirm;
    });
  });
  
  describe('Loading State', () => {
    it('shows loading spinner when loading is true', async () => {
      const el = await fixture(html`
        <dashboard-widget loading></dashboard-widget>
      `);
      
      const loadingSpinner = el.shadowRoot.querySelector('.loading-spinner');
      expect(loadingSpinner).to.exist;
      
      const content = el.shadowRoot.querySelector('slot');
      expect(content).to.not.exist;
    });
    
    it('hides loading spinner when loading is false', async () => {
      const el = await fixture(html`
        <dashboard-widget .loading="${false}"></dashboard-widget>
      `);
      
      const loadingSpinner = el.shadowRoot.querySelector('.loading-spinner');
      expect(loadingSpinner).to.not.exist;
      
      const content = el.shadowRoot.querySelector('slot');
      expect(content).to.exist;
    });
  });
  
  describe('Error State', () => {
    it('shows error message when error is set', async () => {
      const errorMessage = 'Something went wrong';
      const el = await fixture(html`
        <dashboard-widget .error="${errorMessage}"></dashboard-widget>
      `);
      
      const errorEl = el.shadowRoot.querySelector('.widget-error');
      expect(errorEl).to.exist;
      expect(errorEl.textContent).to.include(errorMessage);
      
      const retryBtn = errorEl.querySelector('button');
      expect(retryBtn).to.exist;
    });
    
    it('retry button fires refresh event', async () => {
      const el = await fixture(html`
        <dashboard-widget
          widget-id="test-widget"
          .error="${'Error'}">
        </dashboard-widget>
      `);
      
      let eventFired = false;
      
      el.addEventListener('widget-refresh', () => {
        eventFired = true;
      });
      
      const retryBtn = el.shadowRoot.querySelector('.widget-error button');
      retryBtn.click();
      
      expect(eventFired).to.be.true;
    });
  });
  
  describe('Footer', () => {
    it('renders footer when provided', async () => {
      const footerText = 'Widget Footer';
      const el = await fixture(html`
        <dashboard-widget .footer="${footerText}"></dashboard-widget>
      `);
      
      const footer = el.shadowRoot.querySelector('.widget-footer');
      expect(footer).to.exist;
      expect(footer.textContent).to.include(footerText);
    });
    
    it('does not render footer when not provided', async () => {
      const el = await fixture(html`
        <dashboard-widget></dashboard-widget>
      `);
      
      const footer = el.shadowRoot.querySelector('.widget-footer');
      expect(footer).to.not.exist;
    });
  });
  
  describe('Public Methods', () => {
    it('refresh method sets loading state', async () => {
      const el = await fixture(html`
        <dashboard-widget></dashboard-widget>
      `);
      
      expect(el.loading).to.be.false;
      
      el.refresh();
      expect(el.loading).to.be.true;
      expect(el.error).to.be.null;
      
      // Wait for simulated async operation
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(el.loading).to.be.false;
    });
    
    it('setError method sets error state', async () => {
      const el = await fixture(html`
        <dashboard-widget></dashboard-widget>
      `);
      
      const errorMsg = 'Test error';
      el.setError(errorMsg);
      
      await el.updateComplete;
      
      expect(el.error).to.equal(errorMsg);
      expect(el.loading).to.be.false;
    });
    
    it('clearError method clears error state', async () => {
      const el = await fixture(html`
        <dashboard-widget .error="${'Some error'}"></dashboard-widget>
      `);
      
      expect(el.error).to.exist;
      
      el.clearError();
      await el.updateComplete;
      
      expect(el.error).to.be.null;
    });
  });
});