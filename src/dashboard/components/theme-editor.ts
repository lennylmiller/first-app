import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { themeService } from '../services/theme-service.js';
import { storage } from '../services/storage-service.js';

interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  border: string;
  borderFocus: string;
}

interface PresetTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
  };
}

interface CustomTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  created: string;
}

@customElement('theme-editor')
export class ThemeEditor extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      
      .theme-editor {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
      }
      
      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      
      .editor-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
      
      .editor-actions {
        display: flex;
        gap: 0.5rem;
      }
      
      .color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .color-group {
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        padding: 1rem;
      }
      
      .group-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        margin-bottom: 0.75rem;
        text-transform: uppercase;
      }
      
      .color-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      
      .color-label {
        font-size: 0.813rem;
        color: var(--color-text-primary);
        flex: 1;
      }
      
      .color-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .color-input {
        width: 40px;
        height: 40px;
        border: 2px solid var(--input-border);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: border-color var(--transition-fast);
      }
      
      .color-input:hover {
        border-color: var(--color-primary);
      }
      
      .color-value {
        font-family: monospace;
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        width: 80px;
      }
      
      .preset-themes {
        margin-bottom: 1.5rem;
      }
      
      .preset-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
      
      .preset-card {
        background-color: var(--color-background);
        border: 2px solid var(--input-border);
        border-radius: var(--border-radius);
        padding: 1rem;
        cursor: pointer;
        transition: all var(--transition-fast);
        text-align: center;
      }
      
      .preset-card:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
      }
      
      .preset-card.active {
        border-color: var(--color-primary);
        background-color: var(--sidebar-hover);
      }
      
      .preset-preview {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
        margin-bottom: 0.5rem;
      }
      
      .preset-color {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid var(--input-border);
      }
      
      .preset-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
      }
      
      .preview-section {
        background-color: var(--color-background);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        margin-top: 1.5rem;
      }
      
      .preview-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 1rem;
      }
      
      .preview-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      
      .preview-item {
        padding: 1rem;
        border-radius: var(--border-radius);
        background-color: var(--color-surface);
        border: 1px solid var(--input-border);
      }
      
      .preview-text {
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
      }
      
      .preview-secondary {
        color: var(--color-text-secondary);
        font-size: 0.875rem;
      }
      
      .theme-name-input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--color-surface);
        color: var(--color-text-primary);
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }
      
      .export-import {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      
      .export-import button {
        flex: 1;
      }
      
      /* Mobile styles */
      @media (max-width: 767px) {
        .color-grid {
          grid-template-columns: 1fr;
        }
        
        .preset-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `
  ];
  
  @state()
  private currentTheme: ThemeColors = this.getCurrentThemeColors();
  
  @state()
  private customThemes: CustomTheme[] = storage.get('customThemes', null) || [];
  
  @state()
  private selectedPreset = 'current';
  
  @state()
  private themeName = 'My Custom Theme';
  
  private presetThemes: PresetTheme[] = [
    {
      id: 'default-light',
      name: 'Default Light',
      colors: {
        primary: '#2196F3',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#212121'
      }
    },
    {
      id: 'default-dark',
      name: 'Default Dark',
      colors: {
        primary: '#2196F3',
        background: '#121212',
        surface: '#1E1E1E',
        text: '#E0E0E0'
      }
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      colors: {
        primary: '#006994',
        background: '#E8F4F8',
        surface: '#B8E0EC',
        text: '#003049'
      }
    },
    {
      id: 'forest',
      name: 'Forest Green',
      colors: {
        primary: '#2D6A4F',
        background: '#E9F5E9',
        surface: '#B7E4C7',
        text: '#1B4332'
      }
    },
    {
      id: 'sunset',
      name: 'Sunset',
      colors: {
        primary: '#F77F00',
        background: '#FFF8F3',
        surface: '#FCBF49',
        text: '#003049'
      }
    },
    {
      id: 'midnight',
      name: 'Midnight',
      colors: {
        primary: '#7209B7',
        background: '#0A0E27',
        surface: '#1A1A2E',
        text: '#EAEAEA'
      }
    }
  ];
  
  private getCurrentThemeColors(): ThemeColors {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      // Primary colors
      primary: computedStyle.getPropertyValue('--color-primary').trim() || '#2196F3',
      primaryDark: computedStyle.getPropertyValue('--color-primary-dark').trim() || '#1976D2',
      primaryLight: computedStyle.getPropertyValue('--color-primary-light').trim() || '#BBDEFB',
      
      // Background colors
      background: computedStyle.getPropertyValue('--color-background').trim() || '#FFFFFF',
      surface: computedStyle.getPropertyValue('--color-surface').trim() || '#F5F5F5',
      surfaceVariant: computedStyle.getPropertyValue('--color-surface-variant').trim() || '#E0E0E0',
      
      // Text colors
      textPrimary: computedStyle.getPropertyValue('--color-text-primary').trim() || '#212121',
      textSecondary: computedStyle.getPropertyValue('--color-text-secondary').trim() || '#757575',
      
      // Status colors
      success: computedStyle.getPropertyValue('--color-success').trim() || '#4CAF50',
      warning: computedStyle.getPropertyValue('--color-warning').trim() || '#FF9800',
      error: computedStyle.getPropertyValue('--color-error').trim() || '#F44336',
      info: computedStyle.getPropertyValue('--color-info').trim() || '#2196F3',
      
      // Border colors
      border: computedStyle.getPropertyValue('--input-border').trim() || '#E0E0E0',
      borderFocus: computedStyle.getPropertyValue('--input-focus').trim() || '#2196F3'
    };
  }
  
  render() {
    return html`
      <div class="theme-editor">
        <div class="editor-header">
          <h2 class="editor-title">Theme Editor</h2>
          <div class="editor-actions">
            <button class="btn btn-secondary" @click="${this.resetTheme}">
              Reset
            </button>
            <button class="btn btn-primary" @click="${this.saveTheme}">
              Save Theme
            </button>
          </div>
        </div>
        
        <div class="theme-name-section">
          <input 
            type="text" 
            class="theme-name-input"
            placeholder="Theme name..."
            .value="${this.themeName}"
            @input="${(e: Event) => this.themeName = (e.target as HTMLInputElement).value}">
        </div>
        
        <div class="preset-themes">
          <h3 class="group-title">Preset Themes</h3>
          <div class="preset-grid">
            ${this.presetThemes.map(preset => this.renderPresetCard(preset))}
            ${this.customThemes.map(theme => this.renderCustomThemeCard(theme))}
          </div>
        </div>
        
        <div class="color-grid">
          <div class="color-group">
            <h3 class="group-title">Primary Colors</h3>
            ${this.renderColorInput('primary', 'Primary', this.currentTheme.primary)}
            ${this.renderColorInput('primaryDark', 'Primary Dark', this.currentTheme.primaryDark)}
            ${this.renderColorInput('primaryLight', 'Primary Light', this.currentTheme.primaryLight)}
          </div>
          
          <div class="color-group">
            <h3 class="group-title">Background Colors</h3>
            ${this.renderColorInput('background', 'Background', this.currentTheme.background)}
            ${this.renderColorInput('surface', 'Surface', this.currentTheme.surface)}
            ${this.renderColorInput('surfaceVariant', 'Surface Variant', this.currentTheme.surfaceVariant)}
          </div>
          
          <div class="color-group">
            <h3 class="group-title">Text Colors</h3>
            ${this.renderColorInput('textPrimary', 'Text Primary', this.currentTheme.textPrimary)}
            ${this.renderColorInput('textSecondary', 'Text Secondary', this.currentTheme.textSecondary)}
          </div>
          
          <div class="color-group">
            <h3 class="group-title">Status Colors</h3>
            ${this.renderColorInput('success', 'Success', this.currentTheme.success)}
            ${this.renderColorInput('warning', 'Warning', this.currentTheme.warning)}
            ${this.renderColorInput('error', 'Error', this.currentTheme.error)}
            ${this.renderColorInput('info', 'Info', this.currentTheme.info)}
          </div>
          
          <div class="color-group">
            <h3 class="group-title">Border Colors</h3>
            ${this.renderColorInput('border', 'Border', this.currentTheme.border)}
            ${this.renderColorInput('borderFocus', 'Border Focus', this.currentTheme.borderFocus)}
          </div>
        </div>
        
        <div class="preview-section">
          <h3 class="preview-title">Live Preview</h3>
          <div class="preview-content">
            <div class="preview-item">
              <div class="preview-text">Primary Text</div>
              <div class="preview-secondary">Secondary Text</div>
              <button class="btn btn-primary btn-small">Primary Button</button>
            </div>
            <div class="preview-item">
              <div style="padding: 0.5rem; background-color: var(--color-success); color: white; border-radius: var(--border-radius); margin-bottom: 0.5rem;">
                Success Message
              </div>
              <div style="padding: 0.5rem; background-color: var(--color-error); color: white; border-radius: var(--border-radius);">
                Error Message
              </div>
            </div>
            <div class="preview-item">
              <input type="text" placeholder="Input field" style="width: 100%; padding: 0.5rem; border: 1px solid var(--input-border); border-radius: var(--border-radius); background-color: var(--color-surface); color: var(--color-text-primary);">
            </div>
          </div>
        </div>
        
        <div class="export-import">
          <button class="btn btn-secondary" @click="${this.exportTheme}">
            📤 Export Theme
          </button>
          <button class="btn btn-secondary" @click="${this.importTheme}">
            📥 Import Theme
          </button>
        </div>
      </div>
    `;
  }
  
  private renderColorInput(key: keyof ThemeColors, label: string, value: string) {
    return html`
      <div class="color-item">
        <label class="color-label">${label}</label>
        <div class="color-controls">
          <input 
            type="color" 
            class="color-input"
            .value="${value}"
            @input="${(e: Event) => this.updateColor(key, (e.target as HTMLInputElement).value)}">
          <span class="color-value">${value}</span>
        </div>
      </div>
    `;
  }
  
  private renderPresetCard(preset: PresetTheme) {
    return html`
      <div 
        class="preset-card ${this.selectedPreset === preset.id ? 'active' : ''}"
        @click="${() => this.applyPreset(preset)}">
        <div class="preset-preview">
          <div class="preset-color" style="background-color: ${preset.colors.primary}"></div>
          <div class="preset-color" style="background-color: ${preset.colors.background}"></div>
          <div class="preset-color" style="background-color: ${preset.colors.surface}"></div>
          <div class="preset-color" style="background-color: ${preset.colors.text}"></div>
        </div>
        <div class="preset-name">${preset.name}</div>
      </div>
    `;
  }
  
  private renderCustomThemeCard(theme: CustomTheme) {
    return html`
      <div 
        class="preset-card ${this.selectedPreset === theme.id ? 'active' : ''}"
        @click="${() => this.applyCustomTheme(theme)}">
        <div class="preset-preview">
          <div class="preset-color" style="background-color: ${theme.colors.primary}"></div>
          <div class="preset-color" style="background-color: ${theme.colors.background}"></div>
          <div class="preset-color" style="background-color: ${theme.colors.surface}"></div>
          <div class="preset-color" style="background-color: ${theme.colors.textPrimary}"></div>
        </div>
        <div class="preset-name">${theme.name}</div>
      </div>
    `;
  }
  
  private updateColor(key: keyof ThemeColors, value: string): void {
    this.currentTheme = {
      ...this.currentTheme,
      [key]: value
    };
    
    // Apply color immediately for live preview
    this.applyColors();
  }
  
  private applyColors(): void {
    const root = document.documentElement;
    
    // Primary colors
    root.style.setProperty('--color-primary', this.currentTheme.primary);
    root.style.setProperty('--color-primary-dark', this.currentTheme.primaryDark);
    root.style.setProperty('--color-primary-light', this.currentTheme.primaryLight);
    
    // Background colors
    root.style.setProperty('--color-background', this.currentTheme.background);
    root.style.setProperty('--color-surface', this.currentTheme.surface);
    root.style.setProperty('--color-surface-variant', this.currentTheme.surfaceVariant);
    
    // Text colors
    root.style.setProperty('--color-text-primary', this.currentTheme.textPrimary);
    root.style.setProperty('--color-text-secondary', this.currentTheme.textSecondary);
    
    // Status colors
    root.style.setProperty('--color-success', this.currentTheme.success);
    root.style.setProperty('--color-warning', this.currentTheme.warning);
    root.style.setProperty('--color-error', this.currentTheme.error);
    root.style.setProperty('--color-info', this.currentTheme.info);
    
    // Border colors
    root.style.setProperty('--input-border', this.currentTheme.border);
    root.style.setProperty('--input-focus', this.currentTheme.borderFocus);
    
    // Additional derived colors
    root.style.setProperty('--sidebar-hover', this.adjustAlpha(this.currentTheme.primary, 0.1));
    root.style.setProperty('--sidebar-border', this.currentTheme.border);
  }
  
  private adjustAlpha(color: string, alpha: number): string {
    // Convert hex to rgba with alpha
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  private applyPreset(preset: PresetTheme): void {
    this.selectedPreset = preset.id;
    
    // Apply preset colors to current theme
    this.currentTheme = {
      ...this.currentTheme,
      primary: preset.colors.primary,
      primaryDark: this.darken(preset.colors.primary, 0.2),
      primaryLight: this.lighten(preset.colors.primary, 0.4),
      background: preset.colors.background,
      surface: preset.colors.surface,
      surfaceVariant: this.darken(preset.colors.surface, 0.1),
      textPrimary: preset.colors.text,
      textSecondary: this.lighten(preset.colors.text, 0.3)
    };
    
    this.applyColors();
  }
  
  private applyCustomTheme(theme: CustomTheme): void {
    this.selectedPreset = theme.id;
    this.currentTheme = { ...theme.colors };
    this.themeName = theme.name;
    this.applyColors();
  }
  
  private darken(color: string, amount: number): string {
    // Simple darken function
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) * (1 - amount));
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }
  
  private lighten(color: string, amount: number): string {
    // Simple lighten function
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + (255 * amount));
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + (255 * amount));
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + (255 * amount));
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }
  
  private saveTheme(): void {
    const theme: CustomTheme = {
      id: `custom-${Date.now()}`,
      name: this.themeName,
      colors: { ...this.currentTheme },
      created: new Date().toISOString()
    };
    
    this.customThemes = [...this.customThemes, theme];
    storage.set('customThemes', this.customThemes);
    storage.set('currentCustomTheme', theme);
    
    this.dispatchEvent(new CustomEvent('theme-saved', {
      detail: { theme },
      bubbles: true,
      composed: true
    }));
    
    alert(`Theme "${this.themeName}" saved successfully!`);
  }
  
  private resetTheme(): void {
    if (confirm('Reset to default theme colors?')) {
      const defaultLight = this.presetThemes[0];
      this.applyPreset(defaultLight);
    }
  }
  
  private exportTheme(): void {
    const theme = {
      name: this.themeName,
      colors: this.currentTheme,
      exported: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `theme-${this.themeName.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  
  private importTheme(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result as string;
          const theme = JSON.parse(result);
          if (theme.colors) {
            this.currentTheme = theme.colors;
            this.themeName = theme.name || 'Imported Theme';
            this.applyColors();
            alert('Theme imported successfully!');
          }
        } catch (error) {
          alert('Error importing theme: Invalid file format');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }
}