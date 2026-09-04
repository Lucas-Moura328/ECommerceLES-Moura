## Contrato api

A Api sempre retorna:

```
Response<T>
{
    message: string;
    dados: T;
}
```

Porta API
https://localhost:7094
http://localhost:5134

- Não haverá JWT
- Não haverá login persistente
- Não haverá sessão complexa

As primeiras funcionalidades que serão implementadas após a arquitetura são:

## CRUD de Clientes

### CLIENTE

- Home
- Meu Perfil
    - Dados pessoais
    - Endereços
    - Alteração de senha

### ADMIN

- Listagem de clientes
- Filtro de clientes
- Busca de clientes
- Ativar cliente
- Desativar cliente
- Visualizar detalhes do cliente

As demais páginas serão implementadas posteriormente.

# Contrato da API

## Clientes

A API de clientes está disponível através de `docs/api/Cliente`.

## Fonte

Os schemas e contratos técnicos devem ser consultados em `openapi.json`.