import { inject, InjectionToken } from '@angular/core';
import { AccessibilityDomRenderer } from '../../domain';
import { AccessibilityDomRendererImpl } from './accessibility-dom-renderer.service';

export const ACCESSIBILITY_DOM_RENDERER_TOKEN = new InjectionToken<AccessibilityDomRenderer>(
  'ACCESSIBILITY_DOM_RENDERER_TOKEN',
  {
    factory: () => inject(AccessibilityDomRendererImpl),
  }
);
