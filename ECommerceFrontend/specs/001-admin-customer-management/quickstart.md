# Quickstart & Guia de Validação: Gestão de Clientes na Área Administrativa

**Feature Branch**: `001-admin-customer-management`  
**Date**: 2026-09-04  
**Feature Spec**: [spec.md](./spec.md)  
**Data Model**: [data-model.md](./data-model.md)  
**API Contracts**: [contracts/admin-customer-api.md](./contracts/admin-customer-api.md)

---

## 1. Pré-Requisitos

1. **Node.js**: Versão 20+ instalada e ativa.
2. **Dependências do Projeto**: Instaladas via `npm install`.
3. **Backend da API**:
   - Backend ASP.NET Core rodando em `https://localhost:7094` ou `http://localhost:5134` (ou mocked via Vitest para testes unitários/integração).

---

## 2. Comandos de Inicialização e Execução

### 2.1 Executar a Aplicação em Desenvolvimento
```bash
npm start
```
- Acessar `http://localhost:4200/admin/customers`.
- A página deve renderizar dentro do `AdminLayoutComponent` com sidebar, topbar e a tabela de clientes.

### 2.2 Executar os Testes Automatizados (Vitest)
```bash
npm test
```
- Valida serviços HTTP (`CustomerService`, `NotificationService`), interceptor de erros e componentes de página/modal.

### 2.3 Validar a Compilação do Projeto
```bash
npm run build
```
- O build deve concluir com 0 erros de TypeScript e 0 warnings impeditivos.

---

## 3. Roteiro de Validação Ponta a Ponta (E2E / Manual)

### Cenário 1: Listagem Inicial de Clientes
1. Acesse a rota `/admin/customers`.
2. **Resultado Esperado**:
   - O indicador de carregamento é exibido brevemente.
   - A tabela lista os clientes com Nome, CPF, E-mail, Telefone e Badge de Status (Verde para "Ativo", Cinza/Vermelho para "Inativo").
   - Ações disponíveis em cada linha: "Detalhes" e "Ativar" / "Desativar".

### Cenário 2: Pesquisa e Filtros
1. No campo de busca, digite o nome de um cliente existente.
2. **Resultado Esperado**: A tabela filtra e exibe apenas clientes que contêm o termo informado.
3. Alterne o filtro de status para "Apenas Ativos" ou "Apenas Inativos".
4. **Resultado Esperado**: A tabela reflete instantaneamente o status selecionado.
5. Clique em "Limpar Filtros".
6. **Resultado Esperado**: A listagem completa é restaurada.

### Cenário 3: Exibição de Detalhes do Cliente
1. Clique no botão "Detalhes" de um cliente da lista.
2. **Resultado Esperado**:
   - O modal de detalhes (`CustomerDetailModalComponent`) abre sobre a página.
   - Exibe informações pessoais: Nome, CPF, Data de Nascimento formatada (dd/MM/yyyy), Gênero, E-mail e Telefone com DDD.
   - Exibe a lista de endereços com logradouro, número, bairro, cidade, UF, CEP e tags claras informando se é endereço de entrega e/ou cobrança.
3. Feche o modal clicando no botão "Fechar" ou na tecla `ESC`.
4. **Resultado Esperado**: O modal fecha suavemente sem recarregar a página ou perder o filtro atual.

### Cenário 4: Desativação e Ativação com Confirmação
1. Em um cliente com status "Ativo", clique no botão "Desativar".
2. **Resultado Esperado**: O modal de confirmação é exibido solicitando confirmação da suspensão.
3. Confirme a desativação.
4. **Resultado Esperado**:
   - Uma requisição `PUT /api/Cliente/{id}/desativar` é executada.
   - O toast verde de sucesso surge no canto superior direito: *"Cliente desativado com sucesso"*.
   - A linha do cliente na tabela atualiza seu badge para "Inativo".
5. No mesmo cliente, clique em "Ativar" e confirme.
6. **Resultado Esperado**:
   - Requisição `PUT /api/Cliente/{id}/ativar` é enviada.
   - O toast exibe: *"Cliente ativado com sucesso"*.
   - O badge atualiza para "Ativo".

### Cenário 5: Tratamento de Erros no Toast Existente
1. Simule uma falha (ex.: interrompa temporariamente a API backend ou acesse um ID inexistente).
2. Tente realizar uma busca ou alterar o status.
3. **Resultado Esperado**:
   - A falha é capturada pelo `errorInterceptor`.
   - O toast vermelho de erro surge no topo da tela descrevendo a mensagem amigável sem congelar a aplicação.
