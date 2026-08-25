import { ValidationErrors } from '@angular/forms';

/** Fonte unica das mensagens de validacao (evita texto solto por formulario). */
export function firstErrorMessage(errors: ValidationErrors | null | undefined): string | null {
  if (!errors) {
    return null;
  }
  if (errors['required']) return 'Campo obrigatorio.';
  if (errors['email']) return 'E-mail invalido.';
  if (errors['min']) return `Valor minimo: ${errors['min'].min}.`;
  if (errors['minlength']) return `Minimo de ${errors['minlength'].requiredLength} caracteres.`;
  if (errors['maxlength']) return `Maximo de ${errors['maxlength'].requiredLength} caracteres.`;
  return 'Valor invalido.';
}
