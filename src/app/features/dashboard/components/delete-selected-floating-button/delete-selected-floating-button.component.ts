import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const fabFade = trigger('fabFade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.7)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.7)' })),
  ]),
]);

@Component({
  selector: 'app-delete-selected-floating-button',
  templateUrl: './delete-selected-floating-button.component.html',
  styleUrl: './delete-selected-floating-button.component.scss',
  imports: [MatIcon, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fabFade],
  host: { '[@fabFade]': '' },
})
export class DeleteSelectedFloatingButtonComponent {
  readonly disabled = input(false);
  readonly deleteSelectedClick = output<void>();

  protected onDeleteSelected(): void {
    this.deleteSelectedClick.emit();
  }
}
