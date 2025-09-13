interface ThemeConfig {
  [key: string]: string;
}

export const darkTheme: ThemeConfig = {
  // Primary colors
  '--color-primary': '#64B5F6',
  '--color-primary-dark': '#42A5F5',
  '--color-primary-light': '#90CAF9',
  '--color-accent': '#FF4081',
  
  // Background colors
  '--color-background': '#121212',
  '--color-surface': '#1E1E1E',
  '--color-surface-variant': '#2C2C2C',
  
  // Text colors
  '--color-text-primary': '#FFFFFF',
  '--color-text-secondary': '#B0B0B0',
  '--color-text-disabled': '#666666',
  
  // Sidebar colors
  '--sidebar-bg': '#1A1A1A',
  '--sidebar-text': '#E0E0E0',
  '--sidebar-hover': '#2C2C2C',
  '--sidebar-active': '#64B5F6',
  '--sidebar-active-text': '#000000',
  '--sidebar-border': '#2C2C2C',
  
  // Header colors
  '--header-bg': '#1E1E1E',
  '--header-text': '#FFFFFF',
  '--header-shadow': '0 2px 4px rgba(0,0,0,0.3)',
  
  // Component colors
  '--button-bg': '#64B5F6',
  '--button-text': '#000000',
  '--button-hover': '#42A5F5',
  '--input-border': '#666666',
  '--input-focus': '#64B5F6',
  
  // Status colors
  '--color-success': '#66BB6A',
  '--color-warning': '#FFA726',
  '--color-error': '#EF5350',
  '--color-info': '#64B5F6',
  
  // Shadows and effects
  '--shadow-sm': '0 1px 3px rgba(0,0,0,0.24)',
  '--shadow-md': '0 4px 6px rgba(0,0,0,0.32)',
  '--shadow-lg': '0 10px 20px rgba(0,0,0,0.38)',
  '--border-radius': '4px',
  '--border-radius-lg': '8px',
  
  // Transitions
  '--transition-fast': '150ms ease-in-out',
  '--transition-normal': '250ms ease-in-out',
  '--transition-slow': '350ms ease-in-out'
};