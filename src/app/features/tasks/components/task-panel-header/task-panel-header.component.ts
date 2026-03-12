import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { TaskPanelFilterOption, TaskPanelSortOption } from '../../domain';

@Component({
  selector: 'app-task-panel-header',
  templateUrl: './task-panel-header.component.html',
  styleUrl: './task-panel-header.component.scss',
  imports: [MatIconModule, MatTooltipModule, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPanelHeaderComponent {
  readonly headerHost = viewChild.required<ElementRef<HTMLElement>>('headerHost');
  readonly isPomodoroSelectMode = input(false);
  readonly selectedTasksCount = input(0);
  readonly hasSelectedTasks = input(false);
  readonly canEditSelectedTask = input(false);
  readonly isSortDropdownOpen = input(false);
  readonly isSortDropdownClosing = input(false);
  readonly sortOption = input<TaskPanelSortOption>('priority-high-to-low');
  readonly isFilterDropdownOpen = input(false);
  readonly isFilterDropdownClosing = input(false);
  readonly filterOption = input<TaskPanelFilterOption>('all');
  readonly hasActiveFilter = input(false);
  readonly effectiveIsListView = input(false);
  readonly isAccessibleFontEnabled = input(false);
  readonly gridColumnsTooltip = input('Alternar colunas');

  readonly clearSelectionRequested = output<void>();
  readonly editSelectedRequested = output<void>();
  readonly deleteSelectedRequested = output<void>();
  readonly toggleSortDropdownRequested = output<void>();
  readonly closeSortDropdownRequested = output<void>();
  readonly applySortOptionRequested = output<TaskPanelSortOption>();
  readonly toggleFilterDropdownRequested = output<void>();
  readonly closeFilterDropdownRequested = output<void>();
  readonly applyFilterOptionRequested = output<TaskPanelFilterOption>();
  readonly setListViewRequested = output<void>();
  readonly cycleGridColumnsRequested = output<void>();
  readonly toggleTaskCardFontRequested = output<void>();

  protected onClearSelection(): void {
    this.clearSelectionRequested.emit();
  }

  protected onEditSelected(): void {
    this.editSelectedRequested.emit();
  }

  protected onDeleteSelected(): void {
    this.deleteSelectedRequested.emit();
  }

  protected onToggleSortDropdown(): void {
    this.toggleSortDropdownRequested.emit();
  }

  protected onCloseSortDropdown(): void {
    this.closeSortDropdownRequested.emit();
  }

  protected onApplySortOption(option: TaskPanelSortOption): void {
    this.applySortOptionRequested.emit(option);
  }

  protected onToggleFilterDropdown(): void {
    this.toggleFilterDropdownRequested.emit();
  }

  protected onCloseFilterDropdown(): void {
    this.closeFilterDropdownRequested.emit();
  }

  protected onApplyFilterOption(option: TaskPanelFilterOption): void {
    this.applyFilterOptionRequested.emit(option);
  }

  protected onSetListView(): void {
    this.setListViewRequested.emit();
  }

  protected onCycleGridColumns(): void {
    this.cycleGridColumnsRequested.emit();
  }

  protected onToggleTaskCardFont(): void {
    this.toggleTaskCardFontRequested.emit();
  }
}
