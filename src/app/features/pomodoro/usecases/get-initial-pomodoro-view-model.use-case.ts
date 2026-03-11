import { Injectable } from '@angular/core';
import { PomodoroViewModel } from '../domain';
import { POMODORO_DEFAULTS } from '../domain/index';

@Injectable({
  providedIn: 'root',
})
export class GetInitialPomodoroViewModelUseCase {
  execute(): PomodoroViewModel {
    return {
      focusMinutes: POMODORO_DEFAULTS.focusMinutes,
      shortBreakMinutes: POMODORO_DEFAULTS.shortBreakMinutes,
      longBreakMinutes: POMODORO_DEFAULTS.longBreakMinutes,
      longBreakInterval: POMODORO_DEFAULTS.longBreakInterval,
      status: 'idle',
    };
  }
}
