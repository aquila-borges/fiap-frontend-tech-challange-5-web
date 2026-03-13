import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fabFadeAnimation } from '../../../../shared';

@Component({
  selector: 'app-clear-selection-floating-button',
  templateUrl: './clear-selection-floating-button.component.html',
  styleUrl: './clear-selection-floating-button.component.scss',
  imports: [MatIcon, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
})
export class ClearSelectionFloatingButtonComponent {
  readonly disabled = input(false);
  readonly clearSelectionClick = output<void>();

  protected onClearSelection(): void {
    this.clearSelectionClick.emit();
  }
}
