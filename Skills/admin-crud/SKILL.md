---
name: admin-crud
description: Criar uma listagem + formulário no back-office seguindo o padrão já usado em Produtos e Pedidos.
---

# CRUD no Admin

Referência viva: `features/admin/products/` (lista + formulário) e `features/admin/orders/`.

## 1. Listagem

Sempre o mesmo pipeline reativo:

```ts
protected readonly query = signal<AdminListQuery>({ page: 1, pageSize: 10 });

protected readonly result = toSignal(
  toObservable(this.query).pipe(
    debounceTime(200),
    switchMap((q) => this.gateway.listX(q).pipe(catchError(() => of(emptyPage<X>())))),
  ),
  { initialValue: emptyPage<X>() },
);

patch(change: Partial<AdminListQuery>) { this.query.update((q) => ({ ...q, ...change, page: 1 })); }
changePage(page: number) { this.query.update((q) => ({ ...q, page })); }
```

Template:

```html
<ui-section-header title="X" [subtitle]="result().total + ' registros'">
  <a routerLink="novo"><ui-button>Novo</ui-button></a>
</ui-section-header>

<app-table-toolbar [statuses]="statuses" (searchChange)="patch({ search: $event })" (statusChange)="patch({ status: $event })" />
<ui-data-table [columns]="columns" [rows]="result().items" (rowClick)="open($event)" />
<ui-pagination [page]="result().page" [pageSize]="result().pageSize" [total]="result().total" (pageChange)="changePage($event)" />
```

Colunas são declarativas — nunca escreva `<table>` na página:

```ts
protected readonly columns: TableColumn<X>[] = [
  { key: 'name', header: 'Nome', value: (row) => row.name },
  { key: 'total', header: 'Total', value: (row) => row.total.toFixed(2), align: 'right' },
];
```

## 2. Formulário

- Uma **única** página para criar e editar: rotas `.../novo` e `.../:id` apontam para o mesmo componente;
  o `input()` `id` chega vazio na criação.
- `FormBuilder.nonNullable.group(...)` + `Validators`.
- `ui-form-field` envolve cada campo.
- Salvar → `saving.set(true)` → gateway → toast com `response.message` → `router.navigate` para a lista.

## 3. Reaproveite antes de criar

`stat-card`, `table-toolbar`, `order-status-badge` (em `features/admin/shared/components/`),
`ui-data-table`, `ui-pagination`, `ui-modal`, `ui-form-field`. Componente que sirva também ao Cliente
mora em `shared/ui/`.

## 4. Nova seção no menu

Adicione a rota em `features/admin/admin.routes.ts` **e** o item em
`layouts/admin-layout/components/admin-sidebar/admin-sidebar.component.ts` (fonte única do menu).
