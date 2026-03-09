import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  WidgetScaleToggleComponent,
  AccessibleFontToggleComponent,
  FontSizeControlsComponent,
  SpacingControlsComponent,
  AccessibilityResetButtonComponent,
} from '../../components';
import { AccessibilityService } from '../../domain';
import {
  ACCESSIBILITY_SERVICE_TOKEN,
  LoadLoggedUserAccessibilityPreferencesUseCase,
  SaveLoggedUserAccessibilityPreferencesUseCase,
} from '../../index';
import { AccessibilityPreferences } from '../../domain';

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  styleUrl: './accessibility-panel.component.scss',
  imports: [
    WidgetScaleToggleComponent,
    AccessibleFontToggleComponent,
    FontSizeControlsComponent,
    SpacingControlsComponent,
    AccessibilityResetButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityPanelComponent implements OnInit, OnDestroy {
  protected readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);
  private readonly loadPreferencesUseCase = inject(LoadLoggedUserAccessibilityPreferencesUseCase);
  private readonly savePreferencesUseCase = inject(SaveLoggedUserAccessibilityPreferencesUseCase);
  private readonly canPersist = signal(false);
  private saveTimeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      if (!this.canPersist()) {
        return;
      }

      const preferences = this.accessibilityService.getCurrentPreferences();
      this.scheduleSave(preferences);
    });
  }

  async ngOnInit(): Promise<void> {
    const savedPreferences = await this.loadPreferencesUseCase.execute();

    if (savedPreferences) {
      this.accessibilityService.applyPreferences(savedPreferences);
    }

    this.canPersist.set(true);
  }

  ngOnDestroy(): void {
    if (this.saveTimeoutId) {
      clearTimeout(this.saveTimeoutId);
    }
  }

  protected onClose(): void {
    this.accessibilityService.togglePanel();
  }

  private scheduleSave(preferences: AccessibilityPreferences): void {
    if (this.saveTimeoutId) {
      clearTimeout(this.saveTimeoutId);
    }

    this.saveTimeoutId = setTimeout(() => {
      void this.savePreferencesUseCase.execute(preferences);
    }, 300);
  }
}
