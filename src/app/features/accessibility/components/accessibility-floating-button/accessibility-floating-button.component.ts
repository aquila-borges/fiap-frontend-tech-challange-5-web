import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../index';
import { fabFadeAnimation, FloatingActionButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-accessibility-floating-button',
  templateUrl: './accessibility-floating-button.component.html',
  imports: [FloatingActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
})
export class AccessibilityFloatingButtonComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onToggle(): void {
    this.accessibilityService.togglePanel();
  }
}
