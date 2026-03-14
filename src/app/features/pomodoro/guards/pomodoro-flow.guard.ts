import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PomodoroFlowService } from '../infrastructure/services/pomodoro-flow.service';
import { TaskSelectionService, TASK_SELECTION_SERVICE_TOKEN } from '../../tasks';

export const pomodoroSessionGuard: CanActivateFn = () => {
  const flowService = inject(PomodoroFlowService);
  const taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  const router = inject(Router);

  if (flowService.introVisited() || taskSelectionService.hasSelected()) {
    return true;
  }

  return router.createUrlTree(['/pomodoro/intro']);
};

export const pomodoroModeGuard: CanActivateFn = () => {
  const flowService = inject(PomodoroFlowService);
  const taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  const router = inject(Router);

  if (flowService.introVisited() && flowService.sessionVisited()) {
    return true;
  }

  if (taskSelectionService.hasSelected()) {
    return true;
  }

  if (flowService.introVisited()) {
    return router.createUrlTree(['/pomodoro/task']);
  }

  return router.createUrlTree(['/pomodoro/intro']);
};
