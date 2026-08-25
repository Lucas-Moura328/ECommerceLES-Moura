import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Label + conteudo + erro: padroniza o espacamento de todos os formularios. */
@Component({
  selector: 'ui-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="ui-field">
      <span class="ui-field__label">
        {{ label() }}
        @if (required()) {
          <em aria-hidden="true">*</em>
        }
      </span>
      <ng-content />
      @if (hint()) {
        <small class="ui-field__hint">{{ hint() }}</small>
      }
      @if (error()) {
        <small class="ui-field__error">{{ error() }}</small>
      }
    </label>
  `,
  styles: [
    `
      .ui-field { display: grid; gap: 0.35rem; margin-bottom: 1rem; font-size: 0.9rem; }
      .ui-field__label { font-weight: 600; }
      .ui-field__label em { color: var(--color-danger); font-style: normal; }
      .ui-field__hint { color: var(--color-text-muted); }
      .ui-field__error { color: var(--color-danger); }
    `,
  ],
})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly required = input(false);
}
