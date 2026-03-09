import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../index';

@Component({
  selector: 'app-animation-toggle',
  templateUrl: './animation-toggle.component.html',
  styleUrl: './animation-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationToggleComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onToggle(): void {
    this.accessibilityService.toggleReducedMotion();
  }
}
