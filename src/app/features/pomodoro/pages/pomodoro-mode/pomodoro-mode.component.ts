import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
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
  CalculatePomodoroSessionEstimateUseCase,
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
    DragDropModule,
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
  private readonly calculateEstimateUseCase = inject(CalculatePomodoroSessionEstimateUseCase);
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
  protected readonly selectedTaskOrderIds = signal<Task['id'][]>([]);
  protected readonly activeTaskId = signal<Task['id'] | null>(null);
  protected readonly completedFocusCycles = signal(0);
  protected readonly currentPhase = signal<'focus' | 'shortBreak' | 'longBreak'>('focus');
  protected readonly isProcessingTransition = signal(false);
  protected readonly secondsLeft = signal(this.focusDurationSeconds);
  protected readonly timerStatus = signal<'idle' | 'running' | 'paused'>('idle');
  protected readonly hasStartedTimer = signal(false);

  protected readonly selectedTasks = computed(() => {
    const selectedIds = this.taskSelectionService.selectedIds();
    const tasksById = new Map(this.tasks().map(task => [task.id, task] as const));
    const orderedIds = this.selectedTaskOrderIds().filter(id => selectedIds.has(id));
    const missingIds = Array.from(selectedIds).filter(id => !orderedIds.includes(id));

    return [...orderedIds, ...missingIds]
      .map(id => tasksById.get(id))
      .filter((task): task is Task => task !== undefined);
  });

  protected readonly hasSelectedTasks = computed(() => this.selectedTasks().length > 0);
  protected readonly isRunning = computed(() => this.timerStatus() === 'running');

  protected readonly completedTasksCount = computed(() => this.completedFocusCycles());
  protected readonly totalTasksCount = computed(() => this.completedFocusCycles() + this.selectedTasks().length);

  protected readonly estimate = computed(() =>
    this.calculateEstimateUseCase.execute({
      taskCount: this.selectedTasks().length,
      completedCycles: this.completedFocusCycles(),
      remainingSecondsInCurrentPhase: this.secondsLeft(),
      currentPhase: this.currentPhase(),
    })
  );
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
    this.syncSelectedTaskOrder(Array.from(this.taskSelectionService.selectedIds()));
    this.loadTasks();

    this.destroyRef.onDestroy(() => {
      this.stopTimer();
    });
  }

  protected onSelectedTasksDrop(event: CdkDragDrop<Task[]>): void {
    if (this.isRunning() || this.isProcessingTransition()) {
      return;
    }

    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const orderedIds = this.selectedTasks().map(task => task.id);
    const reorderedIds = [...orderedIds];
    moveItemInArray(reorderedIds, event.previousIndex, event.currentIndex);

    this.selectedTaskOrderIds.set(reorderedIds);
    this.taskSelectionService.selectMultiple(reorderedIds);
    this.onResetTimer();
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
          this.syncSelectedTaskOrder();
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
    this.syncSelectedTaskOrder(remainingIds);
  }

  private syncSelectedTaskOrder(selectedIdsInput?: Task['id'][]): void {
    const selectedIds = selectedIdsInput ?? Array.from(this.taskSelectionService.selectedIds());
    const selectedSet = new Set(selectedIds);
    const currentOrder = this.selectedTaskOrderIds();
    const keptIds = currentOrder.filter(id => selectedSet.has(id));
    const missingIds = selectedIds.filter(id => !keptIds.includes(id));

    this.selectedTaskOrderIds.set([...keptIds, ...missingIds]);
  }
}
