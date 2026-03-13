import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { fabFadeAnimation, FloatingActionButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-delete-selected-floating-button',
  templateUrl: './delete-selected-floating-button.component.html',
  imports: [FloatingActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
})
export class DeleteSelectedFloatingButtonComponent {
  readonly disabled = input(false);
  readonly deleteSelectedClick = output<void>();

  protected onDeleteSelected(): void {
    this.deleteSelectedClick.emit();
  }
}
