import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PomodoroFlowService {
  private readonly _introVisited = signal(false);
  private readonly _sessionVisited = signal(false);

  readonly introVisited = this._introVisited.asReadonly();
  readonly sessionVisited = this._sessionVisited.asReadonly();

  markIntroVisited(): void {
    this._introVisited.set(true);
    this._sessionVisited.set(false);
  }

  markSessionVisited(): void {
    this._sessionVisited.set(true);
  }
}
