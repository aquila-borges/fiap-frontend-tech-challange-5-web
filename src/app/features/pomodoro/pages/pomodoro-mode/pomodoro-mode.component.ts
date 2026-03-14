import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  CompleteTaskUseCase,
  ListActiveTasksUseCase,
  Task,
  TaskEmptyPanelSpotlightComponent,
  TaskSelectionService,
  TASK_SELECTION_SERVICE_TOKEN,
} from '../../../tasks';
import { POMODORO_DEFAULTS } from '../../domain';
import {
  PomodoroBackSelectionConfirmationModalComponent,
  PomodoroBackFloatingButtonComponent,
  PomodoroExitConfirmationModalComponent,
  PomodoroExitFloatingButtonComponent,
} from '../../index';

@Component({
  selector: 'app-pomodoro-mode',
  templateUrl: './pomodoro-mode.component.html',
  styleUrl: './pomodoro-mode.component.scss',
  imports: [
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    TaskEmptyPanelSpotlightComponent,
    PomodoroBackFloatingButtonComponent,
    PomodoroExitFloatingButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroModeComponent {
  private readonly listTasksUseCase = inject(ListActiveTasksUseCase);
  private readonly completeTaskUseCase = inject(CompleteTaskUseCase);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
/*
  private readonly focusDurationSeconds = POMODORO_DEFAULTS.focusMinutes * 60;
  private readonly shortBreakDurationSeconds = POMODORO_DEFAULTS.shortBreakMinutes * 60;
  private readonly longBreakDurationSeconds = POMODORO_DEFAULTS.longBreakMinutes * 60;*/
  private readonly focusDurationSeconds = 10;
  private readonly shortBreakDurationSeconds = 5;
  private readonly longBreakDurationSeconds = 8;
  private timerIntervalId: number | null = null;

  protected readonly tasks = signal<Task[]>([]);
  protected readonly activeTaskId = signal<Task['id'] | null>(null);
  protected readonly completedFocusCycles = signal(0);
  protected readonly currentPhase = signal<'focus' | 'shortBreak' | 'longBreak'>('focus');
  protected readonly isProcessingTransition = signal(false);
  protected readonly secondsLeft = signal(this.focusDurationSeconds);
  protected readonly timerStatus = signal<'idle' | 'running' | 'paused'>('idle');
  protected readonly hasStartedTimer = signal(false);

  protected readonly selectedTasks = computed(() => {
    const selectedIds = this.taskSelectionService.selectedIds();
    return this.tasks().filter(task => selectedIds.has(task.id));
  });

  protected readonly hasSelectedTasks = computed(() => this.selectedTasks().length > 0);
  protected readonly isRunning = computed(() => this.timerStatus() === 'running');

  protected readonly completedTasksCount = computed(() => this.completedFocusCycles());
  protected readonly totalTasksCount = computed(() => this.completedFocusCycles() + this.selectedTasks().length);

  protected readonly estimatedTotalHoursLabel = computed(() => {
    const n = this.totalTasksCount();
    if (n === 0) return '0h';

    const { focusMinutes, shortBreakMinutes, longBreakMinutes, longBreakInterval } = POMODORO_DEFAULTS;
    let totalMinutes = n * focusMinutes;
    for (let i = 1; i < n; i++) {
      totalMinutes += (i % longBreakInterval === 0) ? longBreakMinutes : shortBreakMinutes;
    }

    const hours = Math.round((totalMinutes / 60) * 10) / 10;
    return `${hours}h`;
  });

  protected readonly finishAtLabel = computed(() => {
    const n = this.selectedTasks().length;
    const phase = this.currentPhase();
    const c = this.completedFocusCycles();
    const { longBreakInterval } = POMODORO_DEFAULTS;
    const focusSecs = POMODORO_DEFAULTS.focusMinutes * 60;
    const shortBreakSecs = POMODORO_DEFAULTS.shortBreakMinutes * 60;
    const longBreakSecs = POMODORO_DEFAULTS.longBreakMinutes * 60;

    let remaining = this.secondsLeft();

    if (phase === 'focus') {
      for (let i = 0; i < n - 1; i++) {
        const breakCycle = c + 1 + i;
        remaining += (breakCycle % longBreakInterval === 0) ? longBreakSecs : shortBreakSecs;
        remaining += focusSecs;
      }
    } else {
      for (let i = 0; i < n; i++) {
        remaining += focusSecs;
        if (i < n - 1) {
          const breakCycle = c + 1 + i;
          remaining += (breakCycle % longBreakInterval === 0) ? longBreakSecs : shortBreakSecs;
        }
      }
    }

    const finish = new Date(Date.now() + remaining * 1000);
    return `${String(finish.getHours()).padStart(2, '0')}:${String(finish.getMinutes()).padStart(2, '0')}`;
  });
  protected readonly currentPhaseLabel = computed(() => {
    if (this.currentPhase() === 'focus') {
      return 'Tempo de foco';
    }

    if (this.currentPhase() === 'shortBreak') {
      return 'Pausa curta';
    }

    return 'Pausa longa';
  });
  protected readonly formattedTime = computed(() => {
    const totalSeconds = Math.max(this.secondsLeft(), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  protected readonly timerProgressPercent = computed(() => {
    const duration = this.getDurationForPhase(this.currentPhase());
    const elapsed = duration - this.secondsLeft();
    return Math.min(100, Math.max(0, (elapsed / duration) * 100));
  });

  constructor() {
    this.loadTasks();

    this.destroyRef.onDestroy(() => {
      this.stopTimer();
    });
  }

  protected onToggleTimer(): void {
    if (!this.hasSelectedTasks() || this.isProcessingTransition()) {
      return;
    }

    if (this.isRunning()) {
      this.pauseTimer();
      return;
    }

    if (this.currentPhase() === 'focus' && !this.activeTaskId()) {
      const firstTask = this.selectedTasks()[0];
      if (firstTask) {
        this.activeTaskId.set(firstTask.id);
      }
    }

    if (this.secondsLeft() <= 0) {
      this.secondsLeft.set(this.getDurationForPhase(this.currentPhase()));
    }

    this.startTimer();
  }

  protected onResetTimer(): void {
    this.stopTimer();
    this.currentPhase.set('focus');
    this.activeTaskId.set(null);
    this.completedFocusCycles.set(0);
    this.isProcessingTransition.set(false);
    this.timerStatus.set('idle');
    this.secondsLeft.set(this.focusDurationSeconds);
  }

  protected onBackToSelection(): void {
    if (!this.hasStartedTimer()) {
      this.navigateBackToSelection();
      return;
    }

    this.dialog
      .open(PomodoroBackSelectionConfirmationModalComponent, {
        maxWidth: '90vw',
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.navigateBackToSelection();
        }
      });
  }

  protected onRequestExitPomodoroFlow(): void {
    this.dialog
      .open(PomodoroExitConfirmationModalComponent, {
        maxWidth: '90vw',
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.onExitPomodoroFlow();
        }
      });
  }

  private onExitPomodoroFlow(): void {
    this.stopTimer();
    this.activeTaskId.set(null);
    this.taskSelectionService.clearSelection();
    this.router.navigate(['/pomodoro/intro']);
  }

  private startTimer(): void {
    this.stopTimer();
    this.hasStartedTimer.set(true);
    this.timerStatus.set('running');

    this.timerIntervalId = window.setInterval(() => {
      const nextValue = this.secondsLeft() - 1;

      if (nextValue <= 0) {
        this.secondsLeft.set(0);
        this.stopTimer();
        this.handlePhaseFinished();
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

  private navigateBackToSelection(): void {
    this.stopTimer();
    this.router.navigate(['/pomodoro/task']);
  }

  private handlePhaseFinished(): void {
    if (this.currentPhase() === 'focus') {
      this.finishFocusPhase();
      return;
    }

    this.finishBreakPhase();
  }

  private finishFocusPhase(): void {
    const targetTaskId = this.activeTaskId() ?? this.selectedTasks()[0]?.id;

    if (!targetTaskId) {
      this.startBreakAutomatically();
      return;
    }

    this.isProcessingTransition.set(true);
    this.completeTaskUseCase
      .execute(targetTaskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.tasks.update(currentTasks => currentTasks.filter(task => task.id !== targetTaskId));
          this.removeTaskFromSelection(targetTaskId);
          this.isProcessingTransition.set(false);

          if (this.selectedTasks().length === 0) {
            this.stopTimer();
            this.taskSelectionService.clearSelection();
            this.router.navigate(['/dashboard']);
            return;
          }

          this.startBreakAutomatically();
        },
        error: () => {
          this.isProcessingTransition.set(false);
          this.timerStatus.set('paused');
          this.currentPhase.set('focus');
          this.secondsLeft.set(this.focusDurationSeconds);
        },
      });
  }

  private finishBreakPhase(): void {
    this.currentPhase.set('focus');
    this.secondsLeft.set(this.focusDurationSeconds);
    this.timerStatus.set('paused');

    const firstTask = this.selectedTasks()[0];
    this.activeTaskId.set(firstTask ? firstTask.id : null);
  }

  private startBreakAutomatically(): void {
    this.activeTaskId.set(null);

    const nextCycle = this.completedFocusCycles() + 1;
    this.completedFocusCycles.set(nextCycle);

    const shouldRunLongBreak = nextCycle % POMODORO_DEFAULTS.longBreakInterval === 0;
    this.currentPhase.set(shouldRunLongBreak ? 'longBreak' : 'shortBreak');
    this.secondsLeft.set(this.getDurationForPhase(this.currentPhase()));

    this.startTimer();
  }

  private getDurationForPhase(phase: 'focus' | 'shortBreak' | 'longBreak'): number {
    if (phase === 'focus') {
      return this.focusDurationSeconds;
    }

    if (phase === 'shortBreak') {
      return this.shortBreakDurationSeconds;
    }

    return this.longBreakDurationSeconds;
  }

  private removeTaskFromSelection(taskId: Task['id']): void {
    const remainingIds = Array.from(this.taskSelectionService.selectedIds()).filter(id => id !== taskId);
    this.taskSelectionService.selectMultiple(remainingIds);
  }
}
