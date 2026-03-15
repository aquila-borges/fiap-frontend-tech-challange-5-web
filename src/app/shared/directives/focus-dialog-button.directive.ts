import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';

@Directive({
  selector: '[appFocusDialogButton]',
})
export class FocusDialogButtonDirective {
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef, { optional: true });

  constructor() {
    if (this.dialogRef) {
      this.dialogRef
        .afterOpened()
        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          queueMicrotask(() => {
            this.focusInnerButton();
          });
        });

      return;
    }

    queueMicrotask(() => {
      this.focusInnerButton();
    });
  }

  private focusInnerButton(): void {
    const button = this.hostElement.nativeElement.querySelector('button');

    if (button instanceof HTMLButtonElement) {
      button.focus();
    }
  }
}