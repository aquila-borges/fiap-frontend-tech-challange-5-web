import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../../core';
import { CommonModule } from '@angular/common';

/**
 * Theme Selector Component
 * 
 * Provides UI for switching between available application themes.
 * This component can be placed in settings or user menu.
 * 
 * Usage:
 * <app-theme-selector></app-theme-selector>
 */
@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ThemeSelectorComponent {
  protected readonly themeService: ThemeService;

  constructor(themeService: ThemeService) {
    this.themeService = themeService;
  }

  protected selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }

  protected isActive(themeId: string): boolean {
    return this.themeService.currentTheme() === themeId;
  }
}
