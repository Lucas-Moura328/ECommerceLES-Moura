import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class ClickOutsideDirective {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly appClickOutside = output<void>();

  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target)) {
      this.appClickOutside.emit();
    }
  }
}
