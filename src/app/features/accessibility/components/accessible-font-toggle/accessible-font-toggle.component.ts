import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain/interfaces/accessibility-service.interface';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../services/accessibility-service.token';

@Component({
  selector: 'app-accessible-font-toggle',
  templateUrl: './accessible-font-toggle.component.html',
  styleUrl: './accessible-font-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibleFontToggleComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onToggle(): void {
    this.accessibilityService.toggleAccessibleFont();
  }
}
