import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Indicador visual das etapas do checkout. */
@Component({
  selector: 'app-checkout-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="steps">
      @for (step of steps; track step; let i = $index) {
        <li [class.is-active]="i === current()" [class.is-done]="i < current()">
          <span>{{ i + 1 }}</span>{{ step }}
        </li>
      }
    </ol>
  `,
  styles: [
    `
      .steps { display: flex; gap: 1.25rem; list-style: none; padding: 0; margin: 0 0 1.5rem; font-size: 0.88rem; color: var(--color-text-muted); flex-wrap: wrap; }
      .steps li { display: flex; align-items: center; gap: 0.4rem; }
      .steps span { width: 1.5rem; height: 1.5rem; border-radius: 999px; display: grid; place-items: center; background: var(--color-surface-2); font-size: 0.78rem; }
      .steps .is-active { color: var(--color-text); font-weight: 700; }
      .steps .is-active span, .steps .is-done span { background: var(--color-primary); color: #fff; }
    `,
  ],
})
export class CheckoutStepsComponent {
  readonly current = input(0);
  protected readonly steps = ['Identificacao', 'Entrega', 'Pagamento', 'Revisao'];
}
