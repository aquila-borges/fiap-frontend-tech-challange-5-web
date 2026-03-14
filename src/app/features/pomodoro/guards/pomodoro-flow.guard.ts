import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PomodoroFlowService } from '../infrastructure/services/pomodoro-flow.service';

export const pomodoroSessionGuard: CanActivateFn = () => {
  const flowService = inject(PomodoroFlowService);
  const router = inject(Router);

  if (flowService.setupVisited()) {
    return true;
  }

  return router.createUrlTree(['/pomodoro/intro']);
};

export const pomodoroModeGuard: CanActivateFn = () => {
  const flowService = inject(PomodoroFlowService);
  const router = inject(Router);

  if (flowService.setupVisited() && flowService.sessionVisited()) {
    return true;
  }

  if (flowService.setupVisited()) {
    return router.createUrlTree(['/pomodoro/task']);
  }

  return router.createUrlTree(['/pomodoro/intro']);
};
