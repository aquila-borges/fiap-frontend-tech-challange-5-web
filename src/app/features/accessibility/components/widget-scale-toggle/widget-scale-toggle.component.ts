import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccessibilityService } from '../../domain';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../index';

@Component({
  selector: 'app-widget-scale-toggle',
  templateUrl: './widget-scale-toggle.component.html',
  styleUrl: './widget-scale-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetScaleToggleComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onToggle(): void {
    this.accessibilityService.toggleWidgetScale();
  }
}
