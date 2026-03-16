import { animate, style, transition, trigger } from '@angular/animations';

export const slideDownAnimation = trigger('slideDown', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-10px)' }),
    animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ])
]);
