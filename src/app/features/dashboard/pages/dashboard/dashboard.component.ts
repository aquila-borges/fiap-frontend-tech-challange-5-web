import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddTaskFloatingButtonComponent } from '../../index';
import { ListTasksUseCase, Task, TaskCardsPanelComponent } from '../../../tasks';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [AddTaskFloatingButtonComponent, TaskCardsPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoadingTasks = signal(true);

  private readonly listTasksUseCase = inject(ListTasksUseCase);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.loadTasks();
  }

  protected onTaskCreated(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.isLoadingTasks.set(true);
    this.listTasksUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: tasks => {
          this.tasks.set(tasks);
          this.isLoadingTasks.set(false);
        },
        error: () => {
          this.tasks.set([]);
          this.isLoadingTasks.set(false);
        }
      });
  }
}
