import { Routes } from '@angular/router';
import { PomodoroSetupComponent } from './pages/pomodoro-setup/pomodoro-setup.component';
import { PomodoroSessionComponent } from './pages/pomodoro-session/pomodoro-session.component';
import { PomodoroModeComponent } from './pages/pomodoro-mode/pomodoro-mode.component';

export const POMODORO_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'setup',
  },
  {
    path: 'setup',
    component: PomodoroSetupComponent,
  },
  {
    path: 'session',
    component: PomodoroSessionComponent,
  },
  {
    path: 'mode',
    component: PomodoroModeComponent,
  },
];