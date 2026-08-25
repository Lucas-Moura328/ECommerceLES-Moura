import { Pipe, PipeTransform } from '@angular/core';

/** Formata Money como moeda brasileira sem espalhar CurrencyPipe/locale. */
@Pipe({ name: 'brl' })
export class BrlPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  transform(value: number | null | undefined): string {
    return this.formatter.format(value ?? 0);
  }
}
