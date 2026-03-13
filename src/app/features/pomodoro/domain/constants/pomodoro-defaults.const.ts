const LONG_BREAK_INTERVAL = 4;

export const POMODORO_DEFAULTS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 30,
  longBreakInterval: LONG_BREAK_INTERVAL,
  maxTaskCards: LONG_BREAK_INTERVAL,
} as const;