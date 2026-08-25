# ECommerceLES

E-commerce inspirado no [Fangamer](https://www.fangamer.com), com duas aplicações lógicas — **Cliente** e
**Admin** — em um único projeto Angular 20. Backend previsto: **ASP.NET Core + SQL Server**, com todas as
respostas no envelope `Response<T> { message, dados }`.

Nesta fase o front roda **100% em mockup**: os dados vêm de um "banco" em memória, sem backend, sem JWT e
sem login.

## Rodando

```bash
cd frontend
npm install
npm start     # http://localhost:4200  (loja)
              # http://localhost:4200/admin  (back-office)
npm run build
```

## Estrutura

```
Skills/     habilidades do projeto (como criar feature, contrato de API, virar o mock, CRUD admin, ...)
docs/       ARQUITETURA.md — árvore completa e responsabilidade de cada pasta/componente
frontend/   aplicação Angular
```

Comece por [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) e por [`Skills/README.md`](Skills/README.md).

## Ligando o backend real

Trocar `useMocks` para `false` em `frontend/src/environments/environment.ts` e apontar `apiBaseUrl`.
Nenhum componente muda — a troca acontece em `provideGateways()`. Detalhes em
[`Skills/mock-to-backend/SKILL.md`](Skills/mock-to-backend/SKILL.md).
