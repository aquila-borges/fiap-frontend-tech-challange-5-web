import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-task-empty-state-spotlight',
  templateUrl: './task-empty-state-spotlight.component.html',
  styleUrl: './task-empty-state-spotlight.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEmptyStateSpotlightComponent {}
