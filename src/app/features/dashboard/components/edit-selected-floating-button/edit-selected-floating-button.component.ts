import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { fabFadeAnimation, FloatingActionButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-edit-selected-floating-button',
  templateUrl: './edit-selected-floating-button.component.html',
  imports: [FloatingActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
})
export class EditSelectedFloatingButtonComponent {
  readonly disabled = input(false);
  readonly editSelectedClick = output<void>();

  protected onEditSelected(): void {
    this.editSelectedClick.emit();
  }
}
