import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BrlPipe } from '../../../../../shared/pipes/brl.pipe';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { AdminSalesGateway, DashboardMetrics } from '../../../shared/data-access/admin.gateway';

const EMPTY: DashboardMetrics = {
  revenueToday: 0,
  revenueMonth: 0,
  ordersToday: 0,
  openOrders: 0,
  lowStock: 0,
  conversionRate: 0,
  salesByDay: [],
  topProducts: [],
};

/** Relatorios consolidados (exportacao entra aqui no futuro). */
@Component({
  selector: 'app-reports-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, CardComponent, BrlPipe],
  template: `
    <ui-section-header title="Relatorios" subtitle="Vendas e produtos" />
    <ui-card title="Faturamento por dia">
      <ul>
        @for (day of metrics().salesByDay; track day.date) {
          <li>{{ day.date }} — {{ day.total | brl }}</li>
        }
      </ul>
    </ui-card>
  `,
  styles: ['ul { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.3rem; font-size: 0.9rem; }'],
})
export class ReportsPageComponent {
  private readonly gateway = inject(AdminSalesGateway);
  protected readonly metrics = toSignal(this.gateway.getDashboard().pipe(catchError(() => of(EMPTY))), {
    initialValue: EMPTY,
  });
}
