import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-empty-state-spotlight',
  templateUrl: './task-empty-state-spotlight.component.html',
  styleUrl: './task-empty-state-spotlight.component.scss',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEmptyStateSpotlightComponent {}
