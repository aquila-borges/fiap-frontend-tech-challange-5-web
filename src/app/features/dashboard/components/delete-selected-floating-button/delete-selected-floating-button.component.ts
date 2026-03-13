import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fabFadeAnimation } from '../../../../shared';

@Component({
  selector: 'app-delete-selected-floating-button',
  templateUrl: './delete-selected-floating-button.component.html',
  styleUrl: './delete-selected-floating-button.component.scss',
  imports: [MatIcon, MatTooltipModule],
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
