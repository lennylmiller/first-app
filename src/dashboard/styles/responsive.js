export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.tablet - 1}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wide: `(min-width: ${breakpoints.wide}px)`
};

export const getResponsiveValue = (mobile, tablet, desktop) => {
  if (window.matchMedia(mediaQueries.desktop).matches) {
    return desktop;
  } else if (window.matchMedia(mediaQueries.tablet).matches) {
    return tablet || mobile;
  }
  return mobile;
};

export class ResponsiveController {
  constructor(host) {
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
  
  getBreakpoint() {
    if (window.matchMedia(mediaQueries.mobile).matches) return 'mobile';
    if (window.matchMedia(mediaQueries.tablet).matches) return 'tablet';
    if (window.matchMedia(mediaQueries.wide).matches) return 'wide';
    return 'desktop';
  }
  
  handleBreakpointChange() {
    const newBreakpoint = this.getBreakpoint();
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.host.requestUpdate();
    }
  }
  
  isMobile() {
    return this.currentBreakpoint === 'mobile';
  }
  
  isTablet() {
    return this.currentBreakpoint === 'tablet';
  }
  
  isDesktop() {
    return this.currentBreakpoint === 'desktop' || this.currentBreakpoint === 'wide';
  }
  
  hostDisconnected() {
    Object.values(this.mediaQueryLists).forEach(mql => {
      mql.removeEventListener('change', this.handleBreakpointChange);
    });
  }
}