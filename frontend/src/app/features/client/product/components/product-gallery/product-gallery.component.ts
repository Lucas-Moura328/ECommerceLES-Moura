import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { ProductImage } from '../../../../../core/models';

/** Galeria com miniatura + imagem principal. */
@Component({
  selector: 'app-product-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gallery">
      <img class="gallery__main" [src]="current().url" [alt]="current().alt" />
      <div class="gallery__thumbs">
        @for (image of images(); track image.id; let i = $index) {
          <button type="button" (click)="index.set(i)" [class.is-active]="i === index()">
            <img [src]="image.url" [alt]="image.alt" />
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .gallery__main { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: var(--radius-lg); background: var(--color-surface-2); }
      .gallery__thumbs { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
      .gallery__thumbs button { width: 68px; height: 68px; padding: 0; border: 2px solid transparent; border-radius: var(--radius-md); overflow: hidden; cursor: pointer; background: none; }
      .gallery__thumbs .is-active { border-color: var(--color-primary); }
      .gallery__thumbs img { width: 100%; height: 100%; object-fit: cover; }
    `,
  ],
})
export class ProductGalleryComponent {
  readonly images = input.required<readonly ProductImage[]>();
  protected readonly index = signal(0);
  protected readonly current = computed(
    () => this.images()[this.index()] ?? { id: '', url: '', alt: '' },
  );
}
