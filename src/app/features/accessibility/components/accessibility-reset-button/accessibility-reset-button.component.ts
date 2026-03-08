import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain/interfaces/accessibility-service.interface';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../services/accessibility-service.token';

@Component({
  selector: 'app-accessibility-reset-button',
  templateUrl: './accessibility-reset-button.component.html',
  styleUrl: './accessibility-reset-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityResetButtonComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onReset(): void {
    this.accessibilityService.resetAllSettings();
  }
}
