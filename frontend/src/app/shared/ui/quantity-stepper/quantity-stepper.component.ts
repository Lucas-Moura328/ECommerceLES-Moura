import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-quantity-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-stepper">
      <button type="button" (click)="change(-1)" [disabled]="value() <= min()" aria-label="Diminuir">-</button>
      <span>{{ value() }}</span>
      <button type="button" (click)="change(1)" [disabled]="value() >= max()" aria-label="Aumentar">+</button>
    </div>
  `,
  styles: [
    `
      .ui-stepper {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
      }
      .ui-stepper button { width: 2rem; height: 2rem; border: 0; background: transparent; cursor: pointer; font-size: 1rem; }
      .ui-stepper span { min-width: 2rem; text-align: center; }
    `,
  ],
})
export class QuantityStepperComponent {
  readonly value = input(1);
  readonly min = input(1);
  readonly max = input(99);
  readonly valueChange = output<number>();

  change(delta: number): void {
    this.valueChange.emit(Math.min(this.max(), Math.max(this.min(), this.value() + delta)));
  }
}
