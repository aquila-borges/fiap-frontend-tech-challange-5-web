import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../domain';

@Component({
  selector: 'app-task-cards-panel',
  templateUrl: './task-cards-panel.component.html',
  styleUrl: './task-cards-panel.component.scss',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardsPanelComponent {
  readonly tasks = input<Task[]>([]);
  readonly isLoading = input(false);

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
