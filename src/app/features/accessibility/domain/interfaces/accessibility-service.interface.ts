import { Signal } from '@angular/core';
import type { TextSpacingPreset } from '../index';

/**
 * Application contract for accessibility operations.
 * Manages font scaling, accessible fonts, widget scaling, line height, and text spacing.
 * Implementation lives in the infrastructure layer.
 */
export interface AccessibilityService {
  // Signals
  readonly fontScale: Signal<number>;
  readonly useAccessibleFont: Signal<boolean>;
  readonly widgetScaled: Signal<boolean>;
  readonly lineHeight: Signal<number>;
  readonly textSpacingLevel: Signal<number>;
  readonly reducedMotionEnabled: Signal<boolean>;
  readonly isPanelOpen: Signal<boolean>;

  // Configuration getters
  getScaleSteps(): readonly number[];
  getLineHeightOptions(): readonly number[];
  getTextSpacingPresets(): readonly TextSpacingPreset[];

  // Font scale operations
  increaseFontSize(): void;
  decreaseFontSize(): void;
  isFontScaleAtMax(): boolean;
  isFontScaleAtMin(): boolean;

  // Accessibility toggles
  toggleAccessibleFont(): void;
  toggleWidgetScale(): void;

  // Line height operations
  cycleLineHeight(): void;
  isCustomLineHeightActive(): boolean;

  // Text spacing operations
  cycleTextSpacing(): void;
  isCustomTextSpacingActive(): boolean;
  getTextSpacingLabel(): string;

  // Motion controls
  toggleReducedMotion(): void;

  // General operations
  resetAllSettings(): void;
  togglePanel(): void;
}
