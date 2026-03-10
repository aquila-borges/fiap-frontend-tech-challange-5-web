import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Task } from '../../domain';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { AccessibilityService, ACCESSIBILITY_SERVICE_TOKEN } from '../../../accessibility';

type SortOption = 'priority-high-to-low' | 'priority-low-to-high' | 'date-closest';
type FilterOption = 'all' | 'high-priority' | 'low-priority' | 'closest-date';

@Component({
  selector: 'app-task-cards-panel',
  templateUrl: './task-cards-panel.component.html',
  styleUrl: './task-cards-panel.component.scss',
  imports: [DatePipe, MatIconModule, MatTooltipModule, CommonModule, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardsPanelComponent {
  readonly tasks = input<Task[]>([]);
  readonly isLoading = input(false);
  readonly tasksDeleted = output<Task['id'][]>();
  readonly taskEdit = output<Task>();

  private readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);
  
  protected readonly selectedTaskIds = signal<Set<Task['id']>>(new Set());
  protected readonly clickingTaskId = signal<Task['id'] | null>(null);
  protected readonly isSortDropdownOpen = signal(false);
  protected readonly isFilterDropdownOpen = signal(false);
  protected readonly isSortDropdownClosing = signal(false);
  protected readonly isFilterDropdownClosing = signal(false);
  protected readonly sortOption = signal<SortOption>('priority-high-to-low');
  protected readonly filterOption = signal<FilterOption>('all');
  protected readonly isListView = signal(false);
  protected readonly gridColumns = signal<2 | 3 | 4 | 5>(5);
  protected readonly useHandwrittenTaskFont = signal(true);
  protected readonly isAccessibleFontEnabled = computed(() => this.accessibilityService.useAccessibleFont());
  
  protected readonly filteredTasks = computed(() => {
    const tasksArray = [...this.tasks()];
    const filterBy = this.filterOption();

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
    const sortBy = this.sortOption();

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

  protected clearSelection(): void {
    this.selectedTaskIds.set(new Set());
  }

  protected onCardDoubleClick(task: Task): void {
    // Emite para abertura do modal de edição
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

  protected applySortOption(option: SortOption): void {
    this.sortOption.set(option);
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

  protected applyFilterOption(option: FilterOption): void {
    this.filterOption.set(option);
    this.closeFilterDropdown();
  }

  protected hasActiveFilter(): boolean {
    return this.filterOption() !== 'all';
  }

  protected setListView(): void {
    this.isListView.set(true);
  }

  protected cycleGridColumns(): void {
    this.isListView.set(false);
    this.gridColumns.update(columns => {
      if (columns === 5) {
        return 4;
      }

      if (columns === 4) {
        return 3;
      }

      if (columns === 3) {
        return 2;
      }

      return 5;
    });
  }

  protected toggleTaskCardFont(): void {
    if (this.isAccessibleFontEnabled()) {
      return;
    }

    this.useHandwrittenTaskFont.update(value => !value);
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
