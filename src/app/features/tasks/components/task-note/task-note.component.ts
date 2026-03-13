import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../domain';

@Component({
  selector: 'app-task-note',
  templateUrl: './task-note.component.html',
  styleUrl: './task-note.component.scss',
  imports: [DatePipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskNoteComponent {
  readonly task = input.required<Task>();
  readonly isSelected = input(false);
  readonly isClicking = input(false);
  readonly isDisabled = input(false);
  readonly useHandwrittenTaskFont = input(true);
  readonly isPomodoroSelectMode = input(false);

  readonly selectionToggle = output<Task['id']>();
  readonly editRequested = output<Task>();

  protected readonly today = new Date();

  protected onCardClick(): void {
    this.selectionToggle.emit(this.task().id);
  }

  protected onCardDoubleClick(): void {
    this.editRequested.emit(this.task());
  }

  protected onCardKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.onCardClick();
  }

  protected getPriorityLabel(priority: Task['priority']): string {
    if (priority === 'high') {
      return 'Alta';
    }

    if (priority === 'medium') {
      return 'Média';
    }

    return 'Baixa';
  }

  protected getPriorityClass(priority: Task['priority']): string {
    return `priority-${priority}`;
  }
}
