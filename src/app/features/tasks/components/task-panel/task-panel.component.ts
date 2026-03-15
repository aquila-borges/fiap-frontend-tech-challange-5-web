import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Task } from '../../domain';
import { AccessibilityService, ACCESSIBILITY_SERVICE_TOKEN } from '../../../accessibility';
import {
  TaskPanelHeaderAction,
  TaskPanelHeaderViewModel,
  TaskPanelSortOption,
  TaskPanelFilterOption,
  TaskSelectionService,
  TaskPreferencesService,
} from '../../domain';
import {
  TASK_SELECTION_SERVICE_TOKEN,
  TASK_PREFERENCES_SERVICE_TOKEN,
} from '../../infrastructure';
import { TaskEmptyPanelSpotlightComponent } from '../task-empty-panel-spotlight/task-empty-panel-spotlight.component';
import { TaskPanelHeaderComponent } from '../task-panel-header/task-panel-header.component';
import { TaskPanelHeaderPomodoroComponent } from '../task-panel-header-pomodoro/task-panel-header-pomodoro.component';
import { TaskCardComponent } from '../task-card/task-card.component';

const FORCE_LIST_VIEW_MAX_WIDTH = 580;
const MD_BREAKPOINT_MIN_WIDTH = 768;

@Component({
  selector: 'app-task-panel',
  templateUrl: './task-panel.component.html',
  styleUrl: './task-panel.component.scss',
  imports: [
    MatProgressSpinnerModule,
    TaskEmptyPanelSpotlightComponent,
    TaskPanelHeaderComponent,
    TaskPanelHeaderPomodoroComponent,
    TaskCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPanelComponent {
  readonly tasks = input<Task[]>([]);
  readonly isLoading = input(false);
  readonly isPomodoroSelectMode = input(false);
  readonly pomodoroEstimatedFinishAtLabel = input<string | null>(null);
  readonly pomodoroEstimatedTotalHoursLabel = input<string | null>(null);
  readonly clearSelectionTrigger = input(0);
  readonly editSelectedTaskTrigger = input(0);
  readonly deleteSelectedTasksTrigger = input(0);
  readonly tasksDeleted = output<Task['id'][]>();
  readonly taskEdit = output<Task | Task[]>();

  private readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly taskPreferencesService = inject<TaskPreferencesService>(TASK_PREFERENCES_SERVICE_TOKEN);
  private readonly destroyRef = inject(DestroyRef);
  private headerActionsObserver: IntersectionObserver | null = null;

  protected readonly defaultHeaderRef = viewChild(TaskPanelHeaderComponent);
  protected readonly pomodoroHeaderRef = viewChild(TaskPanelHeaderPomodoroComponent);
  protected readonly clickingTaskId = signal<Task['id'] | null>(null);
  protected readonly isSortDropdownOpen = signal(false);
  protected readonly isFilterDropdownOpen = signal(false);
  protected readonly isSortDropdownClosing = signal(false);
  protected readonly isFilterDropdownClosing = signal(false);
  protected readonly isAccessibleFontEnabled = computed(() => this.accessibilityService.useAccessibleFont());
  protected readonly isListViewForced = computed(
    () => this.taskPreferencesService.viewportWidth() < FORCE_LIST_VIEW_MAX_WIDTH
  );
  public readonly isHeaderActionsVisible = signal(true);
  public readonly isBelowMdViewport = computed(
    () => this.taskPreferencesService.viewportWidth() < MD_BREAKPOINT_MIN_WIDTH
  );
  public readonly selectedTasksCount = this.taskSelectionService.selectedCount;
  public readonly hasSelectedTasksForActions = this.taskSelectionService.hasSelected;
  protected readonly canEditSelectedTask = this.taskSelectionService.canEdit;
  protected readonly effectiveIsListView = computed(
    () => this.taskPreferencesService.isListView() || this.isListViewForced()
  );
  protected readonly effectiveGridColumns = computed<2 | 3 | 4 | 5>(() => {
    const maxColumns = this.getMaxColumnsForViewport(this.taskPreferencesService.viewportWidth());
    return Math.min(this.taskPreferencesService.gridColumns(), maxColumns) as 2 | 3 | 4 | 5;
  });
  protected readonly headerViewModel = computed<TaskPanelHeaderViewModel>(() => {
    const hasSelectedTasks = this.taskSelectionService.hasSelected();

    return {
      totalTasksCount: this.tasks().length,
      selectedTasksCount: this.selectedTasksCount(),
      pomodoroEstimatedFinishAtLabel: hasSelectedTasks ? this.pomodoroEstimatedFinishAtLabel() : null,
      pomodoroEstimatedTotalHoursLabel: hasSelectedTasks ? this.pomodoroEstimatedTotalHoursLabel() : null,
      hasSelectedTasks,
      canEditSelectedTask: this.canEditSelectedTask(),
      isSortDropdownOpen: this.isSortDropdownOpen(),
      isSortDropdownClosing: this.isSortDropdownClosing(),
      sortOption: this.taskPreferencesService.sortOption(),
      isFilterDropdownOpen: this.isFilterDropdownOpen(),
      isFilterDropdownClosing: this.isFilterDropdownClosing(),
      filterOption: this.taskPreferencesService.filterOption(),
      hasActiveFilter: this.taskPreferencesService.filterOption() !== 'all',
      effectiveIsListView: this.effectiveIsListView(),
      isAccessibleFontEnabled: this.isAccessibleFontEnabled(),
      gridColumnsTooltip: this.getGridColumnsTooltip(),
    };
  });

  protected readonly filteredTasks = computed(() => {
    const tasksArray = [...this.tasks()];
    const filterBy: TaskPanelFilterOption = this.taskPreferencesService.filterOption();

    switch (filterBy) {
      case 'high-priority':
        return tasksArray.filter(task => task.priority === 'high');

      case 'low-priority':
        return tasksArray.filter(task => task.priority === 'low');

      case 'closest-date':
        return tasksArray.filter(task => task.dueDate != null);

      default:
        return tasksArray;
    }
  });

  protected readonly sortedTasks = computed(() => {
    const tasksArray = [...this.filteredTasks()];
    const sortBy = this.taskPreferencesService.sortOption();

    switch (sortBy) {
      case 'priority-high-to-low':
        return tasksArray.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

      case 'priority-low-to-high':
        return tasksArray.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

      case 'date-closest':
        return tasksArray.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

      default:
        return tasksArray;
    }
  });

  private clickAnimationTimeoutId: number | null = null;
  private sortDropdownCloseTimeoutId: number | null = null;
  private filterDropdownCloseTimeoutId: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.taskPreferencesService.setViewportWidth(window.innerWidth);

      const onResize = () => this.taskPreferencesService.setViewportWidth(window.innerWidth);
      window.addEventListener('resize', onResize);
      this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
    }

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      effect(() => {
        const headerActionsElement = this.pomodoroHeaderRef()?.headerHost()?.nativeElement
          ?? this.defaultHeaderRef()?.headerHost()?.nativeElement;
        if (!headerActionsElement || this.headerActionsObserver) {
          return;
        }

        this.headerActionsObserver = new IntersectionObserver(
          ([entry]) => {
            this.isHeaderActionsVisible.set(Boolean(entry?.isIntersecting));
          },
          {
            threshold: 0.1,
          }
        );

        this.headerActionsObserver.observe(headerActionsElement);
      });

      this.destroyRef.onDestroy(() => {
        this.headerActionsObserver?.disconnect();
        this.headerActionsObserver = null;
      });
    }

    effect(() => {
      const trigger = this.clearSelectionTrigger();
      if (trigger === 0) {
        return;
      }

      this.taskSelectionService.clearSelection();
    });

    effect(() => {
      const trigger = this.editSelectedTaskTrigger();
      if (trigger === 0) {
        return;
      }

      this.onEditSelectedTask();
    });

    effect(() => {
      const trigger = this.deleteSelectedTasksTrigger();
      if (trigger === 0) {
        return;
      }

      this.onDeleteSelectedTasks();
    });
  }

  protected onDeleteSelectedTasks(): void {
    const selectedIds = Array.from(this.taskSelectionService.selectedIds());
    if (selectedIds.length === 0) {
      return;
    }

    this.tasksDeleted.emit(selectedIds);
  }

  protected onEditSelectedTask(): void {
    if (!this.taskSelectionService.canEdit()) {
      return;
    }

    const selectedTaskIds = this.taskSelectionService.selectedIds();
    if (selectedTaskIds.size === 0) {
      return;
    }

    const selectedTasks = this.tasks().filter(task => selectedTaskIds.has(task.id));
    if (selectedTasks.length === 0) {
      return;
    }

    if (selectedTasks.length === 1) {
      this.taskEdit.emit(selectedTasks[0]);
      return;
    }

    this.taskEdit.emit(selectedTasks);
  }

  protected onTaskCardEditRequested(task: Task): void {
    if (this.isPomodoroSelectMode()) {
      return;
    }

    this.taskEdit.emit(task);
  }

  protected toggleSortDropdown(): void {
    this.isSortDropdownOpen.update(isOpen => !isOpen);
    if (this.isSortDropdownOpen()) {
      this.isFilterDropdownOpen.set(false);
      this.isSortDropdownClosing.set(false);
    }
  }

  protected closeSortDropdown(): void {
    if (this.sortDropdownCloseTimeoutId !== null) {
      clearTimeout(this.sortDropdownCloseTimeoutId);
    }

    this.isSortDropdownClosing.set(true);

    this.sortDropdownCloseTimeoutId = window.setTimeout(() => {
      this.isSortDropdownOpen.set(false);
      this.isSortDropdownClosing.set(false);
      this.sortDropdownCloseTimeoutId = null;
    }, 150);
  }

  protected applySortOption(option: TaskPanelSortOption): void {
    this.taskPreferencesService.setSortOption(option);
    this.closeSortDropdown();
  }

  protected toggleFilterDropdown(): void {
    this.isFilterDropdownOpen.update(isOpen => !isOpen);
    if (this.isFilterDropdownOpen()) {
      this.isSortDropdownOpen.set(false);
      this.isFilterDropdownClosing.set(false);
    }
  }

  protected closeFilterDropdown(): void {
    if (this.filterDropdownCloseTimeoutId !== null) {
      clearTimeout(this.filterDropdownCloseTimeoutId);
    }

    this.isFilterDropdownClosing.set(true);

    this.filterDropdownCloseTimeoutId = window.setTimeout(() => {
      this.isFilterDropdownOpen.set(false);
      this.isFilterDropdownClosing.set(false);
      this.filterDropdownCloseTimeoutId = null;
    }, 150);
  }

  protected applyFilterOption(option: TaskPanelFilterOption): void {
    this.taskPreferencesService.setFilterOption(option);
    this.closeFilterDropdown();
  }

  protected onHeaderAction(action: TaskPanelHeaderAction): void {
    switch (action.type) {
      case 'clear-selection':
        this.taskSelectionService.clearSelection();
        return;
      case 'edit-selected':
        this.onEditSelectedTask();
        return;
      case 'delete-selected':
        this.onDeleteSelectedTasks();
        return;
      case 'toggle-sort-dropdown':
        this.toggleSortDropdown();
        return;
      case 'close-sort-dropdown':
        this.closeSortDropdown();
        return;
      case 'apply-sort-option':
        this.applySortOption(action.option);
        return;
      case 'toggle-filter-dropdown':
        this.toggleFilterDropdown();
        return;
      case 'close-filter-dropdown':
        this.closeFilterDropdown();
        return;
      case 'apply-filter-option':
        this.applyFilterOption(action.option);
        return;
      case 'set-list-view':
        this.setListView();
        return;
      case 'cycle-grid-columns':
        this.cycleGridColumns();
        return;
      case 'toggle-task-card-font':
        this.toggleTaskCardFont();
        return;
      default:
        return;
    }
  }

  protected setListView(): void {
    this.taskPreferencesService.toggleViewMode();
    if (!this.taskPreferencesService.isListView()) {
      this.taskPreferencesService.toggleViewMode();
    }
  }

  protected cycleGridColumns(): void {
    this.taskPreferencesService.toggleViewMode();
    if (this.taskPreferencesService.isListView()) {
      this.taskPreferencesService.toggleViewMode();
    }

    const viewportWidth = this.taskPreferencesService.viewportWidth();
    const maxColumns = this.getMaxColumnsForViewport(viewportWidth);
    this.taskPreferencesService.setGridColumns(
      this.getNextGridColumns(this.taskPreferencesService.gridColumns(), maxColumns)
    );
  }

  protected getGridColumnsTooltip(): string {
    if (this.isListViewForced()) {
      return 'Tela muito pequena: lista aplicada automaticamente';
    }

    const preferred = this.taskPreferencesService.gridColumns();
    const effective = this.effectiveGridColumns();

    if (preferred === effective) {
      return `Alternar colunas (atual: ${preferred})`;
    }

    return `Alternar colunas (preferência: ${preferred}, aplicado no dispositivo: ${effective})`;
  }

  protected toggleTaskCardFont(): void {
    if (this.isAccessibleFontEnabled()) {
      return;
    }

    this.taskPreferencesService.toggleHandwrittenFont();
  }

  protected isSelected(taskId: Task['id']): boolean {
    return this.taskSelectionService.selectedIds().has(taskId);
  }

  protected onToggleTaskSelection(taskId: Task['id']): void {
    this.taskSelectionService.toggleSelection(taskId);
    this.runClickAnimation(taskId);
  }

  private getNextGridColumns(current: 2 | 3 | 4 | 5, maxColumns: 2 | 3 | 4 | 5): 2 | 3 | 4 | 5 {
    const cycleOrder: (2 | 3 | 4 | 5)[] = [5, 4, 3, 2];
    const currentIndex = cycleOrder.indexOf(current);

    for (let offset = 1; offset <= cycleOrder.length; offset += 1) {
      const nextIndex = (currentIndex + offset) % cycleOrder.length;
      const nextCandidate = cycleOrder[nextIndex];

      if (nextCandidate <= maxColumns) {
        return nextCandidate;
      }
    }

    return 2;
  }

  protected isClicking(taskId: Task['id']): boolean {
    return this.clickingTaskId() === taskId;
  }

  protected get useHandwrittenTaskFont() {
    return this.taskPreferencesService.useHandwrittenTaskFont;
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

  private getMaxColumnsForViewport(width: number): 2 | 3 | 4 | 5 {
    if (width < 768) {
      return 2;
    }

    if (width < 992) {
      return 3;
    }

    if (width < 1200) {
      return 4;
    }

    return 5;
  }
}
