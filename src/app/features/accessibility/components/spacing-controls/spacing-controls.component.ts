import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnimationToggleComponent } from '../animation-toggle/animation-toggle.component';
import { LineHeightToggleComponent } from '../line-height-toggle/line-height-toggle.component';
import { TextSpacingToggleComponent } from '../text-spacing-toggle/text-spacing-toggle.component';
import { SaturationToggleComponent } from '../saturation-toggle/saturation-toggle.component';

@Component({
  selector: 'app-spacing-controls',
  templateUrl: './spacing-controls.component.html',
  styleUrl: './spacing-controls.component.css',
  imports: [LineHeightToggleComponent, TextSpacingToggleComponent, AnimationToggleComponent, SaturationToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpacingControlsComponent {}
