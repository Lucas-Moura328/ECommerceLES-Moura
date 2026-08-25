---
name: design-system
description: Criar ou alterar componentes visuais compartilhados e usar os design tokens.
---

# Design system

## Onde mora o quê

| Pasta | Regra |
| --- | --- |
| `shared/ui/` | Componente **sem regra de negócio**, usável por Cliente e Admin. Prefixo de seletor `ui-`. |
| `features/<app>/<feature>/components/` | Componente que conhece o domínio daquela feature. Prefixo `app-`. |
| `layouts/**/components/` | Peças de moldura (header, sidebar, footer). |

Um componente de feature usado por uma segunda feature **sobe** para `shared/ui/` e perde o vocabulário
de negócio.

## Tokens

Nunca escreva cor, raio ou espaçamento cru. Use as variáveis de `src/styles/_tokens.scss`:

```scss
var(--color-bg) var(--color-surface) var(--color-surface-2) var(--color-border)
var(--color-text) var(--color-text-muted)
var(--color-primary) var(--color-accent) var(--color-danger)
var(--radius-sm) var(--radius-md) var(--radius-lg)
var(--container) var(--header-height)
```

Mudar a identidade visual da loja = editar `_tokens.scss`, nada mais.

## Convenções de componente

- `changeDetection: ChangeDetectionStrategy.OnPush`.
- Entradas com `input()` / `input.required()`; saídas com `output()`.
- Estilos inline (`styles: [...]`) quando curtos; `styleUrl` quando passarem de ~40 linhas.
- Conteúdo por `<ng-content />`, com slots nomeados quando houver mais de uma área
  (ex.: `<ng-content select="[cardActions]" />`).
- Acessibilidade: `aria-label` em botões de ícone, `role="dialog"` + `aria-modal` em modal,
  `alt` em toda imagem.

## Componentes globais

`ui-toast-host` e `ui-loading-bar` são renderizados **uma única vez** em `app.ts`, fora do
`router-outlet`. Não os instancie em páginas.
