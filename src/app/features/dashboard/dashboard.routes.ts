import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PomodoroSetupComponent } from './pages/pomodoro-setup/pomodoro-setup.component';
import { PomodoroSessionComponent } from './pages/pomodoro-session/pomodoro-session.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'pomodoro/setup',
    component: PomodoroSetupComponent,
  },
  {
    path: 'pomodoro/session',
    component: PomodoroSessionComponent,
  }
];
