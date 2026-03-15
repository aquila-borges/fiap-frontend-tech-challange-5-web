import { DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScrollSentinel]',
  standalone: true,
})
export class InfiniteScrollSentinelDirective {
  readonly reached = output<void>();

  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private observer: IntersectionObserver | null = null;

  constructor() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          this.reached.emit();
        }
      },
      {
        rootMargin: '240px 0px',
        threshold: 0,
      }
    );

    this.observer.observe(this.hostRef.nativeElement);

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      this.observer = null;
    });
  }
}