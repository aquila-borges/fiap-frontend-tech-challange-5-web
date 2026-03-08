import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WidgetScaleToggleComponent } from '../../components/widget-scale-toggle/widget-scale-toggle.component';
import { AccessibleFontToggleComponent } from '../../components/accessible-font-toggle/accessible-font-toggle.component';
import { FontSizeControlsComponent } from '../../components/font-size-controls/font-size-controls.component';
import { SpacingControlsComponent } from '../../components/spacing-controls/spacing-controls.component';
import { AccessibilityResetButtonComponent } from '../../components/accessibility-reset-button/accessibility-reset-button.component';
import { AccessibilityService } from '../../domain/interfaces/accessibility-service.interface';
import { ACCESSIBILITY_SERVICE_TOKEN } from '../../services/accessibility-service.token';

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
