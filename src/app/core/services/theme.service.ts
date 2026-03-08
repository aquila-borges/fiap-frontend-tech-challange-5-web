import { Injectable, signal, effect } from '@angular/core';

/**
 * Theme Service
 * 
 * Manages application theming using CSS custom properties.
 * Provides theme switching capabilities and persistence.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private readonly DEFAULT_THEME = 'default';
  
  /**
   * Available themes in the application
   */
  readonly availableThemes = [
    { id: 'default', name: 'Tema Padrão', description: 'Gradiente roxo/azul' }
  ];

  /**
   * Current active theme
   */
  readonly currentTheme = signal<string>(this.loadTheme());

  constructor() {
    // Apply theme on changes and persist to storage
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      this.saveTheme(theme);
    });
  }

  /**
   * Set the active theme
   * @param themeId Theme identifier (e.g., 'default', 'dark')
   */
  setTheme(themeId: string): void {
    const theme = this.availableThemes.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme.set(themeId);
    } else {
      console.warn(`Theme "${themeId}" not found. Available themes:`, this.availableThemes.map(t => t.id));
    }
  }

  /**
   * Get the current theme information
   */
  getCurrentThemeInfo() {
    const themeId = this.currentTheme();
    return this.availableThemes.find(t => t.id === themeId) || this.availableThemes[0];
  }

  /**
   * Apply theme class to document body
   */
  private applyTheme(themeId: string): void {
    const body = document.body;
    
    // Remove all theme classes
    this.availableThemes.forEach(theme => {
      body.classList.remove(`theme-${theme.id}`);
    });
    
    // Add new theme class
    if (themeId !== this.DEFAULT_THEME) {
      body.classList.add(`theme-${themeId}`);
    }
  }

  /**
   * Load theme from localStorage
   */
  private loadTheme(): string {
    try {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const isAvailableTheme = this.availableThemes.some(theme => theme.id === savedTheme);
      return isAvailableTheme ? (savedTheme as string) : this.DEFAULT_THEME;
    } catch {
      return this.DEFAULT_THEME;
    }
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(themeId: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, themeId);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }
}
