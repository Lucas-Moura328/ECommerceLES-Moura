import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoadingBarComponent } from './shared/ui/loading-bar/loading-bar.component';
import { ToastHostComponent } from './shared/ui/toast-host/toast-host.component';

/** Shell tecnico: so hospeda o router e os elementos globais (barra + toasts). */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, LoadingBarComponent, ToastHostComponent],
  template: `
    <ui-loading-bar />
    <router-outlet />
    <ui-toast-host />
  `,
})
export class App {}
