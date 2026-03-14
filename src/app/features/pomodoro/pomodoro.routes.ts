import { Routes } from '@angular/router';
import { PomodoroIntroComponent } from './pages/pomodoro-intro/pomodoro-intro.component';
import { PomodoroTaskComponent } from './pages/pomodoro-task/pomodoro-task.component';
import { PomodoroModeComponent } from './pages/pomodoro-mode/pomodoro-mode.component';
import { pomodoroModeGuard, pomodoroSessionGuard } from './guards/pomodoro-flow.guard';

export const POMODORO_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'intro',
  },
  {
    path: 'intro',
    component: PomodoroIntroComponent,
  },
  {
    path: 'task',
    canActivate: [pomodoroSessionGuard],
    component: PomodoroTaskComponent,
  },
  {
    path: 'mode',
    canActivate: [pomodoroModeGuard],
    component: PomodoroModeComponent,
  },
];