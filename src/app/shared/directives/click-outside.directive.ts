import { Directive, ElementRef, EventEmitter, Output, DestroyRef, inject } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter((event) => {
          const target = event.target as Node;
          return !this.elementRef.nativeElement.contains(target);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.clickOutside.emit();
      });
  }
}
