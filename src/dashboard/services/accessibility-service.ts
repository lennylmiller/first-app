/**
 * Accessibility Service
 * Manages ARIA live regions, focus management, and screen reader announcements
 */

type FocusTrapCleanup = () => void;
type KeyboardNavCleanup = () => void;

interface RouteNameMap {
  [path: string]: string;
}

class AccessibilityService {
  private liveRegion: HTMLElement | null;
  private urgentRegion: HTMLElement | null;
  private focusTrap: FocusTrapCleanup | null;

  constructor() {
    this.liveRegion = null;
    this.urgentRegion = null;
    this.focusTrap = null;
    this.init();
  }
  
  init(): void {
    // Create ARIA live region for announcements
    this.createLiveRegion();
    
    // Setup global keyboard navigation helpers
    this.setupKeyboardHelpers();
    
    // Monitor route changes for announcements
    this.monitorRouteChanges();
  }
  
  createLiveRegion(): void {
    // Create polite live region for general announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.liveRegion);
    
    // Create assertive live region for urgent announcements
    this.urgentRegion = document.createElement('div');
    this.urgentRegion.setAttribute('aria-live', 'assertive');
    this.urgentRegion.setAttribute('aria-atomic', 'true');
    this.urgentRegion.className = 'sr-only';
    this.urgentRegion.style.cssText = this.liveRegion.style.cssText;
    document.body.appendChild(this.urgentRegion);
  }
  
  announce(message: string, urgent: boolean = false): void {
    const region = urgent ? this.urgentRegion : this.liveRegion;

    if (!region) return;

    // Clear previous announcement
    region.textContent = '';

    // Use setTimeout to ensure screen readers pick up the change
    setTimeout(() => {
      if (region) region.textContent = message;
    }, 100);

    // Clear after announcement
    setTimeout(() => {
      if (region) region.textContent = '';
    }, 3000);
  }
  
  setupKeyboardHelpers(): void {
    // Skip to main content link
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // Alt + M to skip to main content
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        this.focusMain();
      }
      
      // Alt + N to skip to navigation
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        this.focusNavigation();
      }
      
      // Escape to close modals/dialogs
      if (e.key === 'Escape') {
        this.closeTopModal();
      }
    });
  }
  
  monitorRouteChanges(): void {
    // Announce route changes to screen readers
    window.addEventListener('vaadin-router-location-changed', (e: CustomEvent) => {
      const path = e.detail.location.pathname;
      const routeName = this.getRouteNameFromPath(path);
      this.announce(`Navigated to ${routeName}`);
      
      // Move focus to main content area
      setTimeout(() => this.focusMain(), 100);
    });
  }
  
  getRouteNameFromPath(path: string): string {
    const routeNames: RouteNameMap = {
      '/': 'Home',
      '/todos': 'Todos',
      '/analytics': 'Analytics',
      '/widgets': 'Widgets',
      '/profile': 'User Profile',
      '/settings': 'Settings'
    };
    
    // Check for exact match
    if (routeNames[path]) {
      return routeNames[path];
    }
    
    // Check for partial matches (e.g., /todos/lit)
    for (const [route, name] of Object.entries(routeNames)) {
      if (path.startsWith(route)) {
        return name;
      }
    }
    
    return 'Page';
  }
  
  focusMain(): void {
    const main = document.querySelector('app-dashboard')?.shadowRoot?.querySelector('main');
    if (main) {
      // Make main focusable if it isn't already
      if (!main.hasAttribute('tabindex')) {
        main.setAttribute('tabindex', '-1');
      }
      (main as HTMLElement).focus();
      this.announce('Main content focused');
    }
  }
  
  focusNavigation(): void {
    const nav = document.querySelector('app-dashboard')?.shadowRoot?.querySelector('app-sidebar');
    if (nav) {
      // Focus first interactive element in navigation
      const firstLink = nav.shadowRoot?.querySelector('a, button');
      if (firstLink) {
        (firstLink as HTMLElement).focus();
        this.announce('Navigation focused');
      }
    }
  }
  
  closeTopModal(): void {
    // Find and close the topmost modal/dialog
    const modals = document.querySelectorAll('[role="dialog"], .modal');
    const visibleModal = Array.from(modals).find(modal => {
      const style = window.getComputedStyle(modal);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    if (visibleModal) {
      // Dispatch close event
      visibleModal.dispatchEvent(new CustomEvent('close'));
    }
  }
  
  // Focus trap for modals and dialogs
  createFocusTrap(element: Element): FocusTrapCleanup {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], ' +
      'input[type="checkbox"], input[type="date"], input[type="color"], ' +
      'input[type="email"], input[type="number"], input[type="password"], ' +
      'input[type="search"], input[type="tel"], input[type="url"], select, ' +
      '[tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          (lastFocusable as HTMLElement).focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          (firstFocusable as HTMLElement).focus();
        }
      }
    };
    
    element.addEventListener('keydown', trapFocus as EventListener);
    
    // Focus first element
    (firstFocusable as HTMLElement)?.focus();
    
    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', trapFocus as EventListener);
    };
  }
  
  // Manage focus for dropdown menus
  setupDropdownKeyboardNav(trigger: Element, menu: Element): KeyboardNavCleanup {
    const menuItems = menu.querySelectorAll('[role="menuitem"]');
    let currentIndex = -1;
    
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentIndex = (currentIndex + 1) % menuItems.length;
          (menuItems[currentIndex] as HTMLElement).focus();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          currentIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
          (menuItems[currentIndex] as HTMLElement).focus();
          break;
          
        case 'Home':
          e.preventDefault();
          currentIndex = 0;
          (menuItems[0] as HTMLElement).focus();
          break;
          
        case 'End':
          e.preventDefault();
          currentIndex = menuItems.length - 1;
          (menuItems[currentIndex] as HTMLElement).focus();
          break;
          
        case 'Escape':
          e.preventDefault();
          menu.setAttribute('aria-expanded', 'false');
          (trigger as HTMLElement).focus();
          break;
      }
    };
    
    menu.addEventListener('keydown', handleKeydown as EventListener);
    
    // Return cleanup function
    return () => {
      menu.removeEventListener('keydown', handleKeydown as EventListener);
    };
  }
  
  // High contrast mode detection
  isHighContrastMode(): boolean {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    return mediaQuery.matches;
  }
  
  // Reduced motion detection
  prefersReducedMotion(): boolean {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  }
  
  // Set page title for screen readers
  setPageTitle(title: string): void {
    document.title = `${title} - Dashboard`;
    this.announce(`Page: ${title}`);
  }
  
  // Manage loading states
  announceLoading(message: string = 'Loading content'): void {
    this.announce(message);
  }
  
  announceLoadingComplete(message: string = 'Content loaded'): void {
    this.announce(message);
  }
  
  // Form validation announcements
  announceFormError(fieldName: string, errorMessage: string): void {
    this.announce(`Error in ${fieldName}: ${errorMessage}`, true);
  }
  
  announceFormSuccess(message: string): void {
    this.announce(message);
  }
  
  // Table navigation helpers
  setupTableKeyboardNav(table: Element): void {
    const rows = table.querySelectorAll('tr');
    const cells = table.querySelectorAll('td, th');
    
    table.addEventListener('keydown', (e: Event) => {
      const ke = e as KeyboardEvent;
      const currentCell = document.activeElement;
      const currentRow = currentCell?.closest('tr');

      if (!currentRow) return;

      const rowIndex = Array.from(rows).indexOf(currentRow);
      const cellIndex = Array.from(currentRow.children).indexOf(currentCell as Element);

      switch (ke.key) {
        case 'ArrowRight':
          ke.preventDefault();
          const nextCell = currentRow.children[cellIndex + 1];
          if (nextCell) (nextCell as HTMLElement).focus();
          break;

        case 'ArrowLeft':
          ke.preventDefault();
          const prevCell = currentRow.children[cellIndex - 1];
          if (prevCell) (prevCell as HTMLElement).focus();
          break;

        case 'ArrowDown':
          ke.preventDefault();
          const nextRow = rows[rowIndex + 1];
          if (nextRow && nextRow.children[cellIndex]) {
            (nextRow.children[cellIndex] as HTMLElement).focus();
          }
          break;

        case 'ArrowUp':
          ke.preventDefault();
          const prevRow = rows[rowIndex - 1];
          if (prevRow && prevRow.children[cellIndex]) {
            (prevRow.children[cellIndex] as HTMLElement).focus();
          }
          break;
      }
    });
  }
}

// Export singleton instance
export const accessibilityService = new AccessibilityService();