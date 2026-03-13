import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fabFadeAnimation } from '../../../../shared';

@Component({
  selector: 'app-edit-selected-floating-button',
  templateUrl: './edit-selected-floating-button.component.html',
  styleUrl: './edit-selected-floating-button.component.scss',
  imports: [MatIcon, MatTooltipModule],
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
