import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PomodoroFlowService {
  private readonly _setupVisited = signal(false);
  private readonly _sessionVisited = signal(false);

  readonly setupVisited = this._setupVisited.asReadonly();
  readonly sessionVisited = this._sessionVisited.asReadonly();

  markSetupVisited(): void {
    this._setupVisited.set(true);
    this._sessionVisited.set(false);
  }

  markSessionVisited(): void {
    this._sessionVisited.set(true);
  }
}
