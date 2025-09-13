import { lightTheme } from '../styles/themes/light-theme.js';
import { darkTheme } from '../styles/themes/dark-theme.js';
import { storage } from './storage-service.js';

interface ThemeConfig {
  [key: string]: string;
}

type ThemeChangeCallback = (themeName: string) => void;

class ThemeService {
  private themes: Record<string, ThemeConfig>;
  private currentTheme: string | null;
  private listeners: Set<ThemeChangeCallback>;

  constructor() {
    this.themes = {
      light: lightTheme,
      dark: darkTheme
    };
    this.currentTheme = null;
    this.listeners = new Set();
  }
  
  init(): string {
    const theme = this.getCurrentTheme();
    this.applyTheme(theme);
    this.setupSystemThemeListener();
    return theme;
  }
  
  getCurrentTheme(): string {
    // 1. Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    if (urlTheme && this.themes[urlTheme]) {
      return urlTheme;
    }
    
    // 2. Check localStorage
    const savedTheme = storage.get<string>('theme');
    if (savedTheme && this.themes[savedTheme]) {
      return savedTheme;
    }
    
    // 3. Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  
  applyTheme(themeName: string): boolean {
    const theme: ThemeConfig | undefined = this.themes[themeName];
    if (!theme) {
      console.error(`Theme "${themeName}" not found`);
      return false;
    }
    
    // Apply CSS custom properties to document root
    Object.entries(theme).forEach(([property, value]: [string, string]) => {
      document.documentElement.style.setProperty(property, value);
    });
    
    // Update document attribute for additional styling hooks
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Save preference
    storage.set('theme', themeName);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('theme', themeName);
    window.history.replaceState({}, '', url.toString());
    
    // Update current theme
    this.currentTheme = themeName;
    
    // Notify listeners
    this.notifyListeners(themeName);
    
    return true;
  }
  
  toggleTheme(): string {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    return newTheme;
  }
  
  addCustomTheme(name: string, theme: ThemeConfig): void {
    if (this.themes[name]) {
      console.warn(`Theme "${name}" already exists and will be overwritten`);
    }
    this.themes[name] = theme;
    storage.set(`custom_theme_${name}`, theme);
  }
  
  removeCustomTheme(name: string): boolean {
    if (name === 'light' || name === 'dark') {
      console.error('Cannot remove default themes');
      return false;
    }
    delete this.themes[name];
    storage.remove(`custom_theme_${name}`);
    return true;
  }
  
  loadCustomThemes(): void {
    const allItems = storage.getAll();
    Object.entries(allItems).forEach(([key, value]) => {
      if (key.startsWith('custom_theme_')) {
        const themeName = key.replace('custom_theme_', '');
        this.themes[themeName] = value;
      }
    });
  }
  
  getAvailableThemes(): string[] {
    return Object.keys(this.themes);
  }
  
  subscribe(callback: ThemeChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  private notifyListeners(themeName: string): void {
    this.listeners.forEach(callback => {
      try {
        callback(themeName);
      } catch (error) {
        console.error('Error in theme change listener:', error);
      }
    });
  }
  
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't set a preference
      if (!storage.has('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
      }
    });
  }
  
  exportTheme(themeName: string): string | null {
    const theme = this.themes[themeName];
    if (!theme) return null;
    
    return JSON.stringify(theme, null, 2);
  }
  
  importTheme(name: string, themeJson: string | ThemeConfig): boolean {
    try {
      const theme = typeof themeJson === 'string' ? JSON.parse(themeJson) : themeJson;
      this.addCustomTheme(name, theme);
      return true;
    } catch (error) {
      console.error('Error importing theme:', error);
      return false;
    }
  }
}

export const themeService = new ThemeService();