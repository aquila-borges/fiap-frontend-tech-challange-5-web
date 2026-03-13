import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { fabFadeAnimation, FloatingActionButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-clear-selection-floating-button',
  templateUrl: './clear-selection-floating-button.component.html',
  imports: [FloatingActionButtonComponent],
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
