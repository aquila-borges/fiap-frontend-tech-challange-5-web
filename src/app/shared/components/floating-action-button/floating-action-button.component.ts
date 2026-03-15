import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-floating-action-button',
  templateUrl: './floating-action-button.component.html',
  styleUrl: './floating-action-button.component.scss',
  imports: [MatRippleModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingActionButtonComponent {
  readonly ariaLabel = input.required<string>();
  readonly icon = input.required<string>();
  readonly tooltip = input.required<string>();
  readonly isTooltipDisabled = input(false);
  readonly tooltipPosition = input<TooltipPosition>('left');
  readonly disabled = input(false);

  readonly bottom = input('0px');
  readonly right = input('0px');
  readonly mobileBottom = input('0px');
  readonly mobileRight = input('1.5rem');

  readonly size = input('64px');
  readonly mobileSize = input('56px');
  readonly iconSize = input('32px');

  readonly backgroundColor = input('var(--color-secondary)');
  readonly outlineColor = input('var(--color-secondary)');

  readonly clicked = output<void>();

  protected readonly resolvedIconClass = () => this.iconMap[this.icon()] ?? 'fa-solid fa-circle-question';

  private readonly iconMap: Record<string, string> = {
    add: 'fa-solid fa-plus',
    accessibility_new: 'fa-solid fa-universal-access',
    close: 'fa-solid fa-xmark',
    delete: 'fa-solid fa-trash',
    edit: 'fa-solid fa-pen',
    play_arrow: 'fa-solid fa-play',
    undo: 'fa-solid fa-rotate-left',
  };

  protected onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.clicked.emit();
  }
}
