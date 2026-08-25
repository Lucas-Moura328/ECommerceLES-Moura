import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'ui-loading-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading.isLoading()) {
      <div class="ui-loading-bar"></div>
    }
  `,
  styles: [
    `
      .ui-loading-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: var(--color-primary); animation: ui-loading 1s ease-in-out infinite; z-index: 70; }
      @keyframes ui-loading { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
    `,
  ],
})
export class LoadingBarComponent {
  protected readonly loading = inject(LoadingService);
}
