import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AccessibilityService } from '../../domain';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../index';

@Component({
  selector: 'app-accessibility-floating-button',
  templateUrl: './accessibility-floating-button.component.html',
  styleUrl: './accessibility-floating-button.component.scss',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityFloatingButtonComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onToggle(): void {
    this.accessibilityService.togglePanel();
  }
}
