import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css',
  imports: [RouterLink, RouterLinkActive, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {
  private readonly STORAGE_KEY = 'app-font-scale';
  private readonly scaleSteps = [100, 112.5, 125, 150, 175, 200] as const;
  private readonly document = globalThis.document ?? inject(DOCUMENT);

  protected readonly currentScale = signal<number>(this.loadInitialScale());
  protected readonly isOffcanvasOpen = signal<boolean>(false);
  protected readonly faUniversalAccess = faUniversalAccess;

  constructor() {
    this.applyScale(this.currentScale());
  }

  protected toggleOffcanvas(): void {
    this.isOffcanvasOpen.update(isOpen => !isOpen);
  }

  protected increaseFontSize(): void {
    const current = this.currentScale();
    const nextScale = this.scaleSteps.find(step => step > current);

    if (!nextScale) {
      return;
    }

    this.currentScale.set(nextScale);
    this.applyScale(nextScale);
  }

  protected decreaseFontSize(): void {
    const current = this.currentScale();
    const prevSteps = this.scaleSteps.filter(step => step < current);
    const previousScale = prevSteps[prevSteps.length - 1];

    if (!previousScale) {
      return;
    }

    this.currentScale.set(previousScale);
    this.applyScale(previousScale);
  }

  protected isScaleMaxed(): boolean {
    return this.currentScale() >= this.scaleSteps[this.scaleSteps.length - 1];
  }

  protected isScaleMinned(): boolean {
    return this.currentScale() <= this.scaleSteps[0];
  }

  private applyScale(scale: number): void {
    this.document.documentElement.style.fontSize = `${scale}%`;
    localStorage.setItem(this.STORAGE_KEY, String(scale));
  }

  private loadInitialScale(): number {
    const raw = Number(localStorage.getItem(this.STORAGE_KEY));
    if (!Number.isFinite(raw)) {
      return this.scaleSteps[0];
    }

    const closest = this.scaleSteps.reduce((prev, current) => {
      return Math.abs(current - raw) < Math.abs(prev - raw) ? current : prev;
    }, this.scaleSteps[0]);

    return closest;
  }
}
