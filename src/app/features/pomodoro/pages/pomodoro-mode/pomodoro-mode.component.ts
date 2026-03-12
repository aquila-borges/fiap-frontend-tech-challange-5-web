import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  ListTasksUseCase,
  Task,
  TaskSelectionService,
  TASK_SELECTION_SERVICE_TOKEN,
} from '../../../tasks';
import { GetInitialPomodoroViewModelUseCase } from '../../usecases';

@Component({
  selector: 'app-pomodoro-mode',
  templateUrl: './pomodoro-mode.component.html',
  styleUrl: './pomodoro-mode.component.scss',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroModeComponent {
  private readonly listTasksUseCase = inject(ListTasksUseCase);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly getInitialPomodoroViewModelUseCase = inject(GetInitialPomodoroViewModelUseCase);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly focusDurationSeconds = this.getInitialPomodoroViewModelUseCase.execute().focusMinutes * 60;
  private timerIntervalId: number | null = null;

  protected readonly tasks = signal<Task[]>([]);
  protected readonly secondsLeft = signal(this.focusDurationSeconds);
  protected readonly timerStatus = signal<'idle' | 'running' | 'paused' | 'finished'>('idle');

  protected readonly selectedTasks = computed(() => {
    const selectedIds = this.taskSelectionService.selectedIds();
    return this.tasks().filter(task => selectedIds.has(task.id)).slice(0, 4);
  });

  protected readonly hasSelectedTasks = computed(() => this.selectedTasks().length > 0);
  protected readonly isRunning = computed(() => this.timerStatus() === 'running');
  protected readonly isFinished = computed(() => this.timerStatus() === 'finished');
  protected readonly formattedTime = computed(() => {
    const totalSeconds = Math.max(this.secondsLeft(), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  protected readonly timerProgressPercent = computed(() => {
    const elapsed = this.focusDurationSeconds - this.secondsLeft();
    return Math.min(100, Math.max(0, (elapsed / this.focusDurationSeconds) * 100));
  });

  constructor() {
    this.loadTasks();

    this.destroyRef.onDestroy(() => {
      this.stopTimer();
    });
  }

  protected onToggleTimer(): void {
    if (!this.hasSelectedTasks()) {
      return;
    }

    if (this.isRunning()) {
      this.pauseTimer();
      return;
    }

    if (this.isFinished()) {
      this.secondsLeft.set(this.focusDurationSeconds);
    }

    this.startTimer();
  }

  protected onResetTimer(): void {
    this.stopTimer();
    this.timerStatus.set('idle');
    this.secondsLeft.set(this.focusDurationSeconds);
  }

  protected onBackToSelection(): void {
    this.stopTimer();
    this.router.navigate(['/pomodoro/session']);
  }

  protected onExitPomodoroFlow(): void {
    this.stopTimer();
    this.taskSelectionService.clearSelection();
    this.router.navigate(['/pomodoro/setup']);
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerStatus.set('running');

    this.timerIntervalId = window.setInterval(() => {
      const nextValue = this.secondsLeft() - 1;

      if (nextValue <= 0) {
        this.secondsLeft.set(0);
        this.stopTimer();
        this.timerStatus.set('finished');
        return;
      }

      this.secondsLeft.set(nextValue);
    }, 1000);
  }

  private pauseTimer(): void {
    this.stopTimer();
    this.timerStatus.set('paused');
  }

  private stopTimer(): void {
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  private loadTasks(): void {
    this.listTasksUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: tasks => {
          this.tasks.set(tasks);
        },
        error: () => {
          this.tasks.set([]);
        },
      });
  }
}
