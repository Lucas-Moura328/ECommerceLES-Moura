# Research & Architectural Decisions: Gestão de Clientes na Área Administrativa

**Feature Branch**: `001-admin-customer-management`  
**Date**: 2026-09-04  
**Feature Spec**: [spec.md](./spec.md)

---

## 1. Diretório Core e Serviços Globais

### Decisão
Implementar a camada central em `src/app/core/` organizada nas seguintes pastas:
- `src/app/core/services/`: Serviços singleton como `NotificationService` e `ApiService`.
- `src/app/core/interceptors/`: Interceptores HTTP funcionais (`error.interceptor.ts`).
- `src/app/core/models/`: Contratos globais de transporte (`api-response.model.ts`, `problem-details.model.ts`).
- `src/app/core/index.ts`: Barrel file para exportação limpa e consumo padronizado.

### Raciocínio (Rationale)
Seguindo as melhores práticas do Angular moderno (v20/21) e o mandato explícito do usuário, o diretório `core` centraliza utilitários transversais e infraestrutura de rede que devem ter instância única (`providedIn: 'root'`). Isso remove a poluição de `shared/`, que fica restrito estritamente a elementos visuais reutilizáveis (UI primitives).

### Alternativas Consideradas
- **Manter os serviços no diretório `shared/`**: Rejeitado pois viola a separação de conceitos do Angular, onde `shared` é para componentes/pipes/diretivas reutilizáveis e `core` é para serviços globais e interceptores.
- **Implementar tratamento de erro diretamente em cada componente**: Rejeitado por duplicar código e violar o princípio DRY.

---

## 2. Sistema de Notificações (Toast) Conectado a Signals

### Decisão
Criar o serviço global `NotificationService` (`src/app/core/services/notification.service.ts`) que gerencia um `signal<ToastNotification[]>`. O componente existente `ToastHostComponent` (`src/app/shared/ui/toast-host/`) passará a injetar o `NotificationService` e sincronizar sua renderização diretamente com esse signal.

### Raciocínio (Rationale)
O arquivo `toast-host.component.ts` já possuía em sua documentação o design previsto: *"renderiza as notificações enviadas pelo NotificationService"*. Ao implementar esse serviço usando Signals do Angular 21, qualquer componente, serviço ou interceptor poderá emitir notificações de erro, sucesso, alerta ou informação (`notificationService.error('Título', 'Mensagem')`) sem necessidade de RxJS complexo ou acoplamento visual.

### Alternativas Consideradas
- **Usar RxJS Subject / Observable**: Rejeitado porque a base de código do projeto utiliza Angular 21 com Signals nativos, proporcionando reatividade mais limpa, melhor performance e fácil integração em templates com ChangeDetection OnPush.
- **Passar mensagens via `@Output()` entre componentes**: Rejeitado porque o `ToastHostComponent` reside no shell do layout (`AdminLayoutComponent`), tornando inviável passar eventos manuais de componentes filhos em rotas internas sem um serviço intermediário.

---

## 3. Interceptor Global de Erros HTTP (ErrorInterceptor)

### Decisão
Criar o interceptor funcional `errorInterceptor` em `src/app/core/interceptors/error.interceptor.ts` utilizando `HttpInterceptorFn`. Registrá-lo em `src/app/app.config.ts` através de `provideHttpClient(withInterceptors([errorInterceptor]))`.

O interceptor irá:
1. Interceptar qualquer falha de rede ou resposta HTTP com status de erro (>= 400).
2. Extrair a mensagem mais descritiva:
   - Se houver corpo de resposta com `message` (envelope `ApiResponse<T>`), utilizá-la.
   - Se for um `ProblemDetails` (com `detail` ou `title`), utilizá-lo.
   - Para erros sem corpo (ex.: conexão recusada no `localhost:7094`), exibir mensagem clara: *"Não foi possível conectar ao servidor. Verifique se o backend está em execução."*
3. Invocar automaticamente `notificationService.error(titulo, mensagem)` para exibir o toast existente na interface.
4. Repassar o erro via `throwError(() => error)` para que os componentes possam resetar estados de loading.

### Raciocínio (Rationale)
Atende com precisão o requisito do usuário: *"Mensagens de erros devem aparecer no toast já existente"*. Garante que 100% das falhas de API sejam capturadas e notificadas visualmente de forma consistente.

### Alternativas Consideradas
- **Tratar erros manualmente em cada subscribe() ou Promise**: Rejeitado por ser suscetível a esquecimentos de desenvolvedores, resultando em falhas silenciosas na interface.

---

## 4. Integração com a API Backend e Endpoints (`swagger.json` e `contrato.md`)

### Decisão
Criar o serviço de domínio `CustomerService` em `src/app/features/admin/customers/services/customer.service.ts` consumindo os endpoints oficiais mapeados do `docs/api/swagger.json`:
- `GET /api/Cliente`: Listagem completa de clientes (`ClienteResponseDtoIEnumerableResponse`).
- `GET /api/Cliente/search?termo={termo}`: Busca de clientes por termo (`ClienteResponseDtoIEnumerableResponse`).
- `GET /api/Cliente/{id}`: Detalhamento de cliente por UUID (`ClienteResponseDtoResponse`).
- `PUT /api/Cliente/{id}/ativar`: Ativação de cliente.
- `PUT /api/Cliente/{id}/desativar`: Desativação de cliente.

Todos os métodos de retorno tipados utilizando o envelope genérico `ApiResponse<T>` (`src/app/core/models/api-response.model.ts`).

### Raciocínio (Rationale)
Fidelidade total aos contratos pré-existentes. O `CustomerService` orquestra as chamadas HTTP mantendo a URL base dinâmica originada de `environment.apiBaseUrl` (`https://localhost:7094` ou `http://localhost:5134`).

### Alternativas Consideradas
- **Filtro apenas no frontend**: Rejeitado para buscas textuais extensas, pois o backend já fornece `/api/Cliente/search`. Adota-se a combinação: busca textual via API e filtros instantâneos de status (Ativo/Inativo) em memória via `computed()`.

---

## 5. UI/UX: Modais de Detalhes e Confirmação de Status

### Decisão
Utilizar o componente primitivo `ModalComponent` (`app-modal`) já presente em `src/app/shared/ui/modal/` para:
1. **Modal de Detalhes do Cliente** (`CustomerDetailModalComponent`): Exibe abas ou seções para dados pessoais, telefones, e-mail, status e cartões de endereços (com badges para entrega/cobrança).
2. **Modal de Confirmação de Alteração de Status** (`CustomerStatusConfirmModalComponent`): Solicita confirmação explícita antes de chamar `/api/Cliente/{id}/ativar` ou `/api/Cliente/{id}/desativar`.

### Raciocínio (Rationale)
O componente `ModalComponent` já possui estrutura com overlay, tecla ESC, bloqueio de scroll no body e slots de `ng-content` para corpo e rodapé. Reutilizá-lo garante consistência visual e velocidade de entrega.

### Alternativas Consideradas
- **Navegar para rota filha `/admin/customers/:id`**: Rejeitado para a listagem backoffice pois abreviar a inspeção rápida em modal preserva os filtros e o scroll da tabela do administrador.

---

## 6. Arquitetura e Modularização de Rotas (`app.routes.ts`)

### Decisão
Reestruturar o roteamento para delegar rotas específicas de domínio aos seus respectivos módulos:
- `src/app/features/admin/admin.routes.ts`: Roteamento da área administrativa (`dashboard`, `customers`).
- `src/app/features/client/client.routes.ts`: Roteamento da área de clientes (`home`, `profile`, etc.).
- `src/app/app.routes.ts`: Arquivo raiz enxuto que apenas aponta o layout pai e utiliza `loadChildren` para os arquivos de rotas específicos.

### Raciocínio (Rationale)
Atende o requisito: *"Respeitar a separação por responsabilidade já existente no projeto (/admin/customers , /client/) ajustando o app.routes (admin e client) para seus respectivos diretórios."* Isso desacopla os contextos, facilita lazy loading e evita que um único arquivo de rotas centralize todas as páginas do sistema.

### Alternativas Consideradas
- **Manter todas as rotas filhas embutidas em `app.routes.ts`**: Rejeitado pois contraria a solicitação direta do usuário e dificulta a manutenção em projetos de médio e grande porte.
