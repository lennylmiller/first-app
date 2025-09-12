import { LitElement, html, css } from 'lit';
import { sharedStyles } from './styles/shared-styles.js';
import { ResponsiveController } from './styles/responsive.js';
import { themeService } from './services/theme-service.js';
import { keyboardShortcuts } from './services/keyboard-shortcuts-service.js';
import { accessibilityService } from './services/accessibility-service.js';
import './components/app-sidebar.js';
import './components/app-header.js';

export class AppDashboard extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        background-color: var(--color-background);
        color: var(--color-text-primary);
      }
      
      .dashboard-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      
      .dashboard-body {
        display: flex;
        flex: 1;
        overflow: hidden;
        min-height: 0; /* Important for flex children */
      }
      
      .dashboard-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: auto;
        background-color: var(--color-background);
        transition: margin-left var(--transition-normal);
        min-width: 0; /* Prevent flex item from overflowing */
      }
      
      .dashboard-content.sidebar-open {
        margin-left: 260px;
      }
      
      .dashboard-content.sidebar-closed {
        margin-left: 0;
      }
      
      #outlet {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      
      /* Mobile styles */
      @media (max-width: 767px) {
        .dashboard-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: opacity var(--transition-normal), visibility var(--transition-normal);
        }
        
        .dashboard-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }
      }
      
      /* Desktop styles */
      @media (min-width: 1024px) {
        .dashboard-content.sidebar-open {
          margin-left: 260px;
        }
        
        .dashboard-content.sidebar-closed {
          margin-left: 64px;
        }
      }
    `
  ];
  
  static properties = {
    sidebarOpen: { type: Boolean, state: true },
    currentRoute: { type: String, state: true },
    theme: { type: String, state: true },
    user: { type: Object, state: true },
    loading: { type: Boolean, state: true }
  };
  
  constructor() {
    super();
    this.sidebarOpen = true;
    this.currentRoute = '/';
    this.theme = 'light';
    this.loading = false;
    this.user = {
      name: 'Lenny Miller',
      email: 'lenny.l.miller@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Lenny+Miller&background=2196F3&color=fff'
    };
    
    this.responsive = new ResponsiveController(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Initialize theme
    this.theme = themeService.init();
    
    // Subscribe to theme changes
    this.unsubscribeTheme = themeService.subscribe((theme) => {
      this.theme = theme;
    });
    
    // Setup responsive sidebar behavior
    this.setupResponsiveSidebar();
    
    // Setup global event listeners for keyboard shortcuts
    this.setupGlobalListeners();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribeTheme) {
      this.unsubscribeTheme();
    }
  }
  
  setupResponsiveSidebar() {
    // Auto-close sidebar on mobile
    if (this.responsive.isMobile()) {
      this.sidebarOpen = false;
    }
  }
  
  setupGlobalListeners() {
    // Listen for toggle-sidebar events from keyboard shortcuts
    window.addEventListener('toggle-sidebar', (e) => {
      // Only handle if this is from keyboard shortcuts (not from header button)
      // Header button events are handled by the @toggle-sidebar listener in render()
      if (e.detail && e.detail.source === 'keyboard') {
        this.toggleSidebar();
      }
    });
    
    // Listen for toggle-theme events from keyboard shortcuts
    window.addEventListener('toggle-theme', () => {
      const newTheme = this.theme === 'light' ? 'dark' : 'light';
      themeService.applyTheme(newTheme);
    });
    
    // Listen for navigate events from keyboard shortcuts
    window.addEventListener('navigate', (e) => {
      this.handleNavigation(e);
    });
  }
  
  render() {
    const showBackdrop = this.responsive.isMobile() && this.sidebarOpen;
    
    return html`
      <div class="dashboard-container" role="application" aria-label="Dashboard Application">
        <app-header
          .user="${this.user}"
          .theme="${this.theme}"
          @toggle-sidebar="${() => this.toggleSidebar()}"
          @theme-change="${this.handleThemeChange}"
          role="banner"
          aria-label="Dashboard Header">
        </app-header>
        
        <div class="dashboard-body">
          <app-sidebar
            ?open="${this.sidebarOpen}"
            .currentRoute="${this.currentRoute}"
            .responsive="${this.responsive.currentBreakpoint}"
            @toggle="${() => this.toggleSidebar()}"
            @navigate="${this.handleNavigation}"
            role="navigation"
            aria-label="Main Navigation">
          </app-sidebar>
          
          <main 
            class="dashboard-content ${this.sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}"
            role="main"
            aria-label="Main Content"
            tabindex="-1">
            <div id="outlet" aria-live="polite" aria-busy="${this.loading}">
              <!-- Router outlet will be attached here -->
            </div>
          </main>
        </div>
        
        ${showBackdrop ? html`
          <div 
            class="dashboard-backdrop visible"
            @click="${this.closeSidebar}">
          </div>
        ` : ''}
      </div>
    `;
  }
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  
  closeSidebar() {
    this.sidebarOpen = false;
  }
  
  handleThemeChange(e) {
    const newTheme = e.detail.theme;
    themeService.applyTheme(newTheme);
  }
  
  handleNavigation(e) {
    this.currentRoute = e.detail.path;
    
    // Close sidebar on mobile after navigation
    if (this.responsive.isMobile()) {
      this.sidebarOpen = false;
    }
  }
  
  firstUpdated() {
    // Router will be initialized here
    this.initRouter();
  }
  
  async initRouter() {
    // Dynamically import router service
    const { RouterService } = await import('./services/router-service.js');
    
    // Get the outlet element from shadow DOM
    const outlet = this.shadowRoot.querySelector('#outlet');
    
    // Initialize router with outlet
    this.router = new RouterService(outlet);
    
    // Listen for route changes
    window.addEventListener('vaadin-router-location-changed', (e) => {
      this.currentRoute = e.detail.location.pathname;
      this.loading = false;
      
      // Announce route change to screen readers
      const routeName = this.getRouteNameFromPath(e.detail.location.pathname);
      accessibilityService.setPageTitle(routeName);
    });
    
    // Listen for route loading
    window.addEventListener('vaadin-router-location-changing', () => {
      this.loading = true;
      accessibilityService.announceLoading('Loading page...');
    });
  }
  
  getRouteNameFromPath(path) {
    const routeNames = {
      '/': 'Home',
      '/todos': 'Todos',
      '/analytics': 'Analytics',
      '/widgets': 'Widgets',
      '/profile': 'Profile',
      '/settings': 'Settings'
    };
    
    for (const [route, name] of Object.entries(routeNames)) {
      if (path.startsWith(route)) {
        return name;
      }
    }
    
    return 'Dashboard';
  }
}

customElements.define('app-dashboard', AppDashboard);