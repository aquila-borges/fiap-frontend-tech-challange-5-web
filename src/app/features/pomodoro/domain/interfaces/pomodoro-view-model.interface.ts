import { PomodoroStatus } from '../types/pomodoro-status.type';

export interface PomodoroViewModel {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  status: PomodoroStatus;
}
