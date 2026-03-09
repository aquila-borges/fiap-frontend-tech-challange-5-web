import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain/interfaces/accessibility-service.interface';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../services/accessibility-service.token';

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
