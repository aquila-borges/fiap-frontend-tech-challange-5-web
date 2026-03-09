import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../index';

@Component({
  selector: 'app-text-spacing-toggle',
  templateUrl: './text-spacing-toggle.component.html',
  styleUrl: './text-spacing-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextSpacingToggleComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onCycle(): void {
    this.accessibilityService.cycleTextSpacing();
  }
}
