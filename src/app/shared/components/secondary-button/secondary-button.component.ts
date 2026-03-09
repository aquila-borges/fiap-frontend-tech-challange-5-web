import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryButtonComponent {
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);

  readonly clicked = output<void>();

  protected onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
