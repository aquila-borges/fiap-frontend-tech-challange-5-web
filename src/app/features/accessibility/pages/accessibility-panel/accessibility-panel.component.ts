import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  WidgetScaleToggleComponent,
  AccessibleFontToggleComponent,
  FontSizeControlsComponent,
  SpacingControlsComponent,
  AccessibilityResetButtonComponent,
} from '../../components';
import { AccessibilityService } from '../../domain';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../index';

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  styleUrl: './accessibility-panel.component.css',
  imports: [
    WidgetScaleToggleComponent,
    AccessibleFontToggleComponent,
    FontSizeControlsComponent,
    SpacingControlsComponent,
    AccessibilityResetButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityPanelComponent {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);

  protected onClose(): void {
    this.accessibilityService.togglePanel();
  }
}
