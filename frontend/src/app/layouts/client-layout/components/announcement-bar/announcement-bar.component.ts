import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-announcement-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="bar">Frete gratis acima de R$ 299 · Pre-vendas abertas</div>`,
  styles: [
    `
      .bar { background: var(--color-text); color: #fff; text-align: center; font-size: 0.82rem; padding: 0.4rem 1rem; }
    `,
  ],
})
export class AnnouncementBarComponent {}
