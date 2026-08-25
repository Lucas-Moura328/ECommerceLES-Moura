import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="submit($event)">
      <input
        type="search"
        name="q"
        placeholder="Buscar produtos, franquias..."
        [value]="term()"
        (input)="term.set($any($event.target).value)"
      />
    </form>
  `,
  styles: [':host { display: block; }'],
})
export class SearchBarComponent {
  readonly search = output<string>();
  protected readonly term = signal('');

  submit(event: Event): void {
    event.preventDefault();
    const value = this.term().trim();
    if (value) {
      this.search.emit(value);
    }
  }
}
