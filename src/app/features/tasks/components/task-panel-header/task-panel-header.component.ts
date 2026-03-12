import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { TaskPanelFilterOption, TaskPanelHeaderAction, TaskPanelHeaderViewModel, TaskPanelSortOption } from '../../domain';

@Component({
  selector: 'app-task-panel-header',
  templateUrl: './task-panel-header.component.html',
  styleUrl: './task-panel-header.component.scss',
  imports: [MatIconModule, MatTooltipModule, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPanelHeaderComponent {
  readonly headerHost = viewChild.required<ElementRef<HTMLElement>>('headerHost');
  readonly viewModel = input.required<TaskPanelHeaderViewModel>();
  readonly action = output<TaskPanelHeaderAction>();

  protected onClearSelection(): void {
    this.action.emit({ type: 'clear-selection' });
  }

  protected onEditSelected(): void {
    this.action.emit({ type: 'edit-selected' });
  }

  protected onDeleteSelected(): void {
    this.action.emit({ type: 'delete-selected' });
  }

  protected onToggleSortDropdown(): void {
    this.action.emit({ type: 'toggle-sort-dropdown' });
  }

  protected onCloseSortDropdown(): void {
    this.action.emit({ type: 'close-sort-dropdown' });
  }

  protected onApplySortOption(option: TaskPanelSortOption): void {
    this.action.emit({ type: 'apply-sort-option', option });
  }

  protected onToggleFilterDropdown(): void {
    this.action.emit({ type: 'toggle-filter-dropdown' });
  }

  protected onCloseFilterDropdown(): void {
    this.action.emit({ type: 'close-filter-dropdown' });
  }

  protected onApplyFilterOption(option: TaskPanelFilterOption): void {
    this.action.emit({ type: 'apply-filter-option', option });
  }

  protected onSetListView(): void {
    this.action.emit({ type: 'set-list-view' });
  }

  protected onCycleGridColumns(): void {
    this.action.emit({ type: 'cycle-grid-columns' });
  }

  protected onToggleTaskCardFont(): void {
    this.action.emit({ type: 'toggle-task-card-font' });
  }
}
