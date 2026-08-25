---
name: angular-feature
description: Criar uma nova feature ou página Angular (Cliente ou Admin) seguindo o padrão do projeto.
---

# Criar uma feature

## Estrutura obrigatória

```
features/<app>/<feature>/
|-- components/<nome>/<nome>.component.ts     # só desta feature
|-- data-access/<feature>.gateway.ts          # abstract class (contrato)
|-- data-access/<feature>-http.gateway.ts     # implementação HTTP
`-- pages/<nome>-page/<nome>-page.component.ts
```

`<app>` é `client` ou `admin`. Componente usado por duas features sobe para `shared/ui/`.

## Passo a passo

1. **Contrato primeiro.** Crie a `abstract class ...Gateway` com métodos que devolvem **modelos de domínio**
   (`Observable<Product>`), nunca `ApiResponse<T>` em leitura.
2. **Implementação HTTP** injetando `ApiService` (`api.get<T>(...)` já desembrulha `dados`).
3. **Mock** em `src/app/mocks/<feature>-mock.gateway.ts` lendo/escrevendo o `MockDb`.
4. **Registre o par** em `mocks/mocks.providers.ts` (`provideGateways`), nos dois ramos.
5. **Página**: componente standalone, `ChangeDetectionStrategy.OnPush`, dados via `toSignal`.
6. **Rota** com `loadComponent` em `client.routes.ts` ou `admin.routes.ts`, sempre com `title`.
7. `npm run build` antes de considerar pronto.

## Regras não negociáveis

- `input()` / `output()` / `model()` — nunca `@Input()` / `@Output()`.
- `@if` / `@for` / `@switch` — nunca `*ngIf` / `*ngFor`.
- `inject()` — nunca injeção por construtor.
- `ChangeDetectionStrategy.OnPush` em **todo** componente.
- Sem `any`, sem `subscribe` para carregar dados de tela (use `toSignal` + `catchError`).
- Parâmetro de rota chega como `input()` (`withComponentInputBinding()` já está ligado).
- Template acima de ~40 linhas vai para `.html` separado; abaixo disso pode ser inline.

## Template de página com parâmetro de rota

```ts
@Component({
  selector: 'app-exemplo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [/* ... */],
  templateUrl: './exemplo-page.component.html',
})
export class ExemploPageComponent {
  private readonly gateway = inject(ExemploGateway);

  readonly slug = input.required<string>();

  protected readonly data = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) => this.gateway.get(slug).pipe(catchError(() => of(null)))),
    ),
    { initialValue: null },
  );
}
```
