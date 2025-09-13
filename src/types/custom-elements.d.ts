// Type definitions for custom Web Components

// Polymer Element types
declare namespace Polymer {
  interface PolymerElement extends HTMLElement {
    $: Record<string, HTMLElement>;
    push(path: string, ...items: any[]): void;
    splice(path: string, start: number, deleteCount: number, ...items: any[]): void;
    set(path: string, value: any): void;
    notifyPath(path: string): void;
  }

  function html(strings: TemplateStringsArray, ...values: any[]): HTMLTemplateElement;
}

// Lit types extensions
declare module 'lit' {
  interface ReactiveElement {
    updateComplete: Promise<boolean>;
  }
}

// Custom element declarations
declare global {
  interface HTMLElementTagNameMap {
    'todo-raw': HTMLElement;
    'todo-polymer': HTMLElement;
    'todo-lit': HTMLElement;
    'todo-lit-v1': HTMLElement;
    'counter-lit-v1': HTMLElement;
    'settings-modal-raw': HTMLElement;
    'settings-modal-polymer': HTMLElement;
    'settings-modal-lit': HTMLElement;
    'settings-modal-lit-v1': HTMLElement;
    'app-dashboard': HTMLElement;
    'app-header': HTMLElement;
    'app-sidebar': HTMLElement;
    'app-search-bar': HTMLElement;
    'app-user-menu': HTMLElement;
    'app-notifications': HTMLElement;
    'dashboard-widget': HTMLElement;
    'theme-editor': HTMLElement;
    'showcase-view': HTMLElement;
    'todos-view': HTMLElement;
    'analytics-view': HTMLElement;
    'widgets-view': HTMLElement;
    'settings-view': HTMLElement;
    'profile-view': HTMLElement;
    'not-found-view': HTMLElement;
  }

  interface WindowEventMap {
    'navigate': CustomEvent<{ path: string }>;
    'theme-changed': CustomEvent<{ theme: string }>;
    'vaadin-router-go': CustomEvent<{ pathname: string }>;
    'pwa-installable': CustomEvent<{ prompt: any }>;
  }
}

// Router types
declare module '@vaadin/router' {
  export class Router {
    constructor(outlet?: HTMLElement, options?: any);
    setRoutes(routes: RouteConfig[]): void;
    urlForName(name: string, params?: Record<string, any>): string;
    render(pathname: string): Promise<void>;
  }

  export interface RouteConfig {
    path: string;
    name?: string;
    component?: string;
    import?: () => Promise<any>;
    action?: () => void;
    children?: RouteConfig[];
    redirect?: string;
  }

  export interface RouterLocation {
    baseUrl: string;
    pathname: string;
    search: string;
    hash: string;
    params: Record<string, string>;
    route: RouteConfig | null;
  }
}

// Service Worker types
interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  skipWaiting(): Promise<void>;
}

// Todo Item interface
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: number;
}

// Theme interfaces
export interface Theme {
  name: string;
  isDark: boolean;
  colors: ThemeColors;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

// Widget interfaces
export interface WidgetData {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'list' | 'custom';
  data?: any;
  config?: Record<string, any>;
}

// Analytics interfaces
export interface AnalyticsData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export {};