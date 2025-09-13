interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

interface MediaQueries {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}

type BreakpointName = 'mobile' | 'tablet' | 'desktop' | 'wide';

export const breakpoints: Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

export const mediaQueries: MediaQueries = {
  mobile: `(max-width: ${breakpoints.tablet - 1}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wide: `(min-width: ${breakpoints.wide}px)`
};

export const getResponsiveValue = <T>(mobile: T, tablet?: T, desktop?: T): T => {
  if (window.matchMedia(mediaQueries.desktop).matches) {
    return desktop !== undefined ? desktop : mobile;
  } else if (window.matchMedia(mediaQueries.tablet).matches) {
    return tablet !== undefined ? tablet : mobile;
  }
  return mobile;
};

interface ResponsiveHost {
  addController(controller: ResponsiveController): void;
  requestUpdate(): void;
}

export class ResponsiveController {
  private host: ResponsiveHost;
  private currentBreakpoint: BreakpointName;
  private mediaQueryLists: Record<string, MediaQueryList>;

  constructor(host: ResponsiveHost) {
    this.host = host;
    this.currentBreakpoint = this.getBreakpoint();
    this.mediaQueryLists = {};
    
    Object.entries(mediaQueries).forEach(([key, query]) => {
      const mql = window.matchMedia(query);
      this.mediaQueryLists[key] = mql;
      mql.addEventListener('change', () => this.handleBreakpointChange());
    });
    
    host.addController(this);
  }
  
  getBreakpoint(): BreakpointName {
    if (window.matchMedia(mediaQueries.mobile).matches) return 'mobile';
    if (window.matchMedia(mediaQueries.tablet).matches) return 'tablet';
    if (window.matchMedia(mediaQueries.wide).matches) return 'wide';
    return 'desktop';
  }
  
  private handleBreakpointChange(): void {
    const newBreakpoint = this.getBreakpoint();
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.host.requestUpdate();
    }
  }
  
  isMobile(): boolean {
    return this.currentBreakpoint === 'mobile';
  }
  
  isTablet(): boolean {
    return this.currentBreakpoint === 'tablet';
  }
  
  isDesktop(): boolean {
    return this.currentBreakpoint === 'desktop' || this.currentBreakpoint === 'wide';
  }
  
  hostDisconnected(): void {
    Object.values(this.mediaQueryLists).forEach(mql => {
      mql.removeEventListener('change', this.handleBreakpointChange);
    });
  }
}