import { Directive } from '@angular/core';

/** Aplica loading/decoding lazy em todas as imagens de catalogo. */
@Directive({
  selector: 'img[appLazyImg]',
  host: { loading: 'lazy', decoding: 'async' },
})
export class LazyImgDirective {}
