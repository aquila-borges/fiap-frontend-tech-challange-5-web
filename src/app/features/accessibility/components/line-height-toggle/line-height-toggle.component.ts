import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain/interfaces/accessibility-service.interface';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../services/accessibility-service.token';

@Component({
  selector: 'app-line-height-toggle',
  templateUrl: './line-height-toggle.component.html',
  styleUrl: './line-height-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineHeightToggleComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onCycle(): void {
    this.accessibilityService.cycleLineHeight();
  }
}
