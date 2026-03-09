import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AddTaskFloatingButtonComponent } from '../../index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [AddTaskFloatingButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
