import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain/interfaces/accessibility-service.interface';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../services/accessibility-service.token';

@Component({
  selector: 'app-font-size-controls',
  templateUrl: './font-size-controls.component.html',
  styleUrl: './font-size-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontSizeControlsComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onIncrease(): void {
    this.accessibilityService.increaseFontSize();
  }

  protected onDecrease(): void {
    this.accessibilityService.decreaseFontSize();
  }
}
