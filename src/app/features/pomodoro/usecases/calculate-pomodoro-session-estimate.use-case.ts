import { Injectable } from '@angular/core';
import { POMODORO_DEFAULTS } from '../domain/index';
import { PomodoroSessionEstimate, PomodoroSessionEstimateInput } from '../domain/index';

@Injectable({ providedIn: 'root' })
export class CalculatePomodoroSessionEstimateUseCase {
  execute(input: PomodoroSessionEstimateInput): PomodoroSessionEstimate {
    const { taskCount, completedCycles, remainingSecondsInCurrentPhase, currentPhase } = input;
    const { focusMinutes, shortBreakMinutes, longBreakMinutes, longBreakInterval } = POMODORO_DEFAULTS;

    const totalCycles = completedCycles + taskCount;

    const focusSecs = focusMinutes * 60;
    const shortBreakSecs = shortBreakMinutes * 60;
    const longBreakSecs = longBreakMinutes * 60;
    const n = taskCount;
    const c = completedCycles;
    let remaining = remainingSecondsInCurrentPhase;

    if (currentPhase === 'focus') {
      for (let i = 0; i < n - 1; i++) {
        const breakCycle = c + 1 + i;
        remaining += (breakCycle % longBreakInterval === 0) ? longBreakSecs : shortBreakSecs;
        remaining += focusSecs;
      }
    } else {
      for (let i = 0; i < n; i++) {
        remaining += focusSecs;
        if (i < n - 1) {
          const breakCycle = c + 1 + i;
          remaining += (breakCycle % longBreakInterval === 0) ? longBreakSecs : shortBreakSecs;
        }
      }
    }

    const remainingTotalMinutes = Math.max(0, Math.ceil(remaining / 60));
    const remainingHoursPart = Math.floor(remainingTotalMinutes / 60);
    const remainingMinutesPart = remainingTotalMinutes % 60;
    const estimatedTotalHoursLabel = `${String(remainingHoursPart).padStart(2, '0')}:${String(remainingMinutesPart).padStart(2, '0')}`;

    const finish = new Date(Date.now() + remaining * 1000);
    const finishAtLabel = `${String(finish.getHours()).padStart(2, '0')}:${String(finish.getMinutes()).padStart(2, '0')}`;

    return {
      taskCount,
      completedCycles,
      totalCycles,
      estimatedTotalHoursLabel,
      finishAtLabel,
    };
  }
}
