import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Task } from '../../domain';

@Component({
  selector: 'app-task-cards-panel',
  templateUrl: './task-cards-panel.component.html',
  styleUrl: './task-cards-panel.component.scss',
  imports: [DatePipe, MatIconModule, MatTooltipModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardsPanelComponent {
  readonly tasks = input<Task[]>([]);
  readonly isLoading = input(false);
  readonly tasksDeleted = output<Task['id'][]>();
  
  protected readonly selectedTaskIds = signal<Set<Task['id']>>(new Set());
  protected readonly clickingTaskId = signal<Task['id'] | null>(null);
  private clickAnimationTimeoutId: number | null = null;

  protected hasSelectedTasks(): boolean {
    return this.selectedTaskIds().size > 0;
  }

  protected onDeleteSelectedTasks(): void {
    if (!this.hasSelectedTasks()) {
      return;
    }

    const idsToDelete = Array.from(this.selectedTaskIds());
    this.tasksDeleted.emit(idsToDelete);
    this.selectedTaskIds.set(new Set());
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

  protected isSelected(taskId: Task['id']): boolean {
    return this.selectedTaskIds().has(taskId);
  }

  protected onToggleTaskSelection(taskId: Task['id']): void {
    this.selectedTaskIds.update(currentSelected => {
      const nextSelected = new Set(currentSelected);

      if (nextSelected.has(taskId)) {
        nextSelected.delete(taskId);
      } else {
        nextSelected.add(taskId);
      }

      return nextSelected;
    });
  }

  protected onCardKeydown(event: KeyboardEvent, taskId: Task['id']): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.onCardClick(taskId);
  }

  protected isClicking(taskId: Task['id']): boolean {
    return this.clickingTaskId() === taskId;
  }

  protected onCardClick(taskId: Task['id']): void {
    this.onToggleTaskSelection(taskId);
    this.runClickAnimation(taskId);
  }

  private runClickAnimation(taskId: Task['id']): void {
    this.clickingTaskId.set(taskId);

    if (this.clickAnimationTimeoutId !== null) {
      clearTimeout(this.clickAnimationTimeoutId);
    }

    this.clickAnimationTimeoutId = window.setTimeout(() => {
      this.clickingTaskId.set(null);
      this.clickAnimationTimeoutId = null;
    }, 150);
  }
}
