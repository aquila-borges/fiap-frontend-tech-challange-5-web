import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../index';

@Component({
  selector: 'app-saturation-toggle',
  templateUrl: './saturation-toggle.component.html',
  styleUrl: './saturation-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaturationToggleComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onCycle(): void {
    this.accessibilityService.cycleSaturation();
  }
}
