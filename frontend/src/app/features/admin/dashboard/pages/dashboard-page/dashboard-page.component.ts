import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BrlPipe } from '../../../../../shared/pipes/brl.pipe';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
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

/** Visao geral da operacao. */
@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, StatCardComponent, CardComponent, BrlPipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  private readonly sales = inject(AdminSalesGateway);
  protected readonly metrics = toSignal(this.sales.getDashboard().pipe(catchError(() => of(EMPTY))), {
    initialValue: EMPTY,
  });
}
