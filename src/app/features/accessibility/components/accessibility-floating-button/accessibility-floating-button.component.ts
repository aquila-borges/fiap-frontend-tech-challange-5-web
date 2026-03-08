import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AccessibilityService } from '../../domain/interfaces/accessibility-service.interface';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../services/accessibility-service.token';

@Component({
  selector: 'app-accessibility-floating-button',
  templateUrl: './accessibility-floating-button.component.html',
  styleUrl: './accessibility-floating-button.component.css',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityFloatingButtonComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onToggle(): void {
    this.accessibilityService.togglePanel();
  }
}
