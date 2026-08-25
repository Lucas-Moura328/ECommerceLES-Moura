import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';

const PAGES: Record<string, { title: string; body: string }> = {
  sobre: { title: 'Sobre a LES Store', body: 'Loja-laboratorio de colecionaveis de games criada para o projeto de Engenharia de Software.' },
  faq: { title: 'Perguntas frequentes', body: 'Prazos, formas de pagamento, pre-vendas e politicas de envio.' },
  trocas: { title: 'Trocas e devolucoes', body: 'Voce tem 7 dias corridos apos o recebimento para solicitar a devolucao.' },
  privacidade: { title: 'Politica de privacidade', body: 'Tratamos os dados pessoais conforme a LGPD.' },
};

/** Paginas institucionais servidas por slug (conteudo estatico por enquanto). */
@Component({
  selector: 'app-static-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  template: `
    <div class="container narrow">
      <ui-section-header [title]="page().title" />
      <p>{{ page().body }}</p>
    </div>
  `,
  styles: ['.narrow { max-width: 720px; }'],
})
export class StaticPageComponent {
  readonly slug = input.required<string>();
  protected readonly page = computed(
    () => PAGES[this.slug()] ?? { title: 'Pagina', body: 'Conteudo em construcao.' },
  );
}
