import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../index';

@Component({
  selector: 'app-contrast-toggle',
  templateUrl: './contrast-toggle.component.html',
  styleUrl: './contrast-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContrastToggleComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onCycle(): void {
    this.accessibilityService.cycleContrast();
  }
}
