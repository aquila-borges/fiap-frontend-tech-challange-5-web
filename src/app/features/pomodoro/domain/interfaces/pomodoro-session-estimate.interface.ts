export interface PomodoroSessionEstimateInput {
  taskCount: number;
  completedCycles: number;
  remainingSecondsInCurrentPhase: number;
  currentPhase: 'focus' | 'shortBreak' | 'longBreak';
}

export interface PomodoroSessionEstimate {
  taskCount: number;
  completedCycles: number;
  totalCycles: number;
  estimatedTotalHoursLabel: string;
  finishAtLabel: string;
}
