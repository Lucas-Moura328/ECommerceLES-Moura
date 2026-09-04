# API Contract: Gestão de Clientes na Área Administrativa

**Fonte de Verdade**: `docs/api/swagger.json` e `contrato.md`  
**Consumidor**: `CustomerService` (`src/app/features/admin/customers/services/customer.service.ts`)  
**Base URL**: Configurada dinamicamente via `environment.apiBaseUrl` (ex.: `https://localhost:7094` ou `http://localhost:5134`)  
**Autenticação**: Nenhuma (Conforme `contrato.md`, NÃO haverá JWT nem sessões complexas)

---

## 1. Listar Todos os Clientes

Retorna a lista completa de clientes cadastrados no sistema.

- **Método**: `GET`
- **Path**: `/api/Cliente`
- **Query Params**: Nenhum

### Resposta de Sucesso (200 OK)
```json
{
  "message": "Clientes recuperados com sucesso",
  "dados": [
    {
      "idCliente": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "nome": "Lucas Moura",
      "cpf": "12345678901",
      "dataNascimento": "1995-05-20T00:00:00Z",
      "ativo": true,
      "email": "lucas@example.com",
      "genero": 0,
      "ddd": "11",
      "telefone": "987654321",
      "isAdmin": false,
      "enderecos": [
        {
          "idEndereco": 1,
          "logradouro": "Rua das Flores",
          "numero": 100,
          "bairro": "Centro",
          "complemento": "Apto 42",
          "cep": "01234567",
          "municipio": "São Paulo",
          "uf": "SP",
          "isEntrega": true,
          "isCobranca": true
        }
      ]
    }
  ]
}
```

---

## 2. Buscar Clientes por Termo

Busca clientes cujo nome, e-mail ou dados cadastrais contenham o termo pesquisado.

- **Método**: `GET`
- **Path**: `/api/Cliente/search`
- **Query Params**:
  - `termo` (string, opcional/obrigatório para consulta): texto digitado pelo administrador na barra de pesquisa.

### Resposta de Sucesso (200 OK)
```json
{
  "message": "Busca realizada com sucesso",
  "dados": [
    {
      "idCliente": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "nome": "Lucas Moura",
      "cpf": "12345678901",
      "dataNascimento": "1995-05-20T00:00:00Z",
      "ativo": true,
      "email": "lucas@example.com",
      "genero": 0,
      "ddd": "11",
      "telefone": "987654321",
      "isAdmin": false,
      "enderecos": []
    }
  ]
}
```

---

## 3. Obter Detalhes do Cliente por ID

Retorna os dados completos e os endereços de um cliente específico.

- **Método**: `GET`
- **Path**: `/api/Cliente/{id}`
- **Path Params**:
  - `id` (string, UUID): Identificador único do cliente.

### Resposta de Sucesso (200 OK)
```json
{
  "message": "Cliente encontrado",
  "dados": {
    "idCliente": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "Lucas Moura",
    "cpf": "12345678901",
    "dataNascimento": "1995-05-20T00:00:00Z",
    "ativo": true,
    "email": "lucas@example.com",
    "genero": 0,
    "ddd": "11",
    "telefone": "987654321",
    "isAdmin": false,
    "enderecos": [
      {
        "idEndereco": 1,
        "logradouro": "Rua das Flores",
        "numero": 100,
        "bairro": "Centro",
        "complemento": "Apto 42",
        "cep": "01234567",
        "municipio": "São Paulo",
        "uf": "SP",
        "isEntrega": true,
        "isCobranca": true
      }
    ]
  }
}
```

### Resposta de Erro (404 Not Found)
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "detail": "Cliente não encontrado para o identificador informado."
}
```

---

## 4. Ativar Cliente

Altera o status cadastral do cliente para ativo.

- **Método**: `PUT`
- **Path**: `/api/Cliente/{id}/ativar`
- **Path Params**:
  - `id` (string, UUID): Identificador do cliente.
- **Request Body**: Vazio

### Resposta de Sucesso (200 OK)
```json
{
  "message": "Cliente ativado com sucesso",
  "dados": true
}
```

---

## 5. Desativar Cliente

Altera o status cadastral do cliente para inativo.

- **Método**: `PUT`
- **Path**: `/api/Cliente/{id}/desativar`
- **Path Params**:
  - `id` (string, UUID): Identificador do cliente.
- **Request Body**: Vazio

### Resposta de Sucesso (200 OK)
```json
{
  "message": "Cliente desativado com sucesso",
  "dados": true
}
```

---

## 6. Comportamento do Error Interceptor em Erros Globais

Caso qualquer uma das requisições retorne status `>= 400` ou falha de conexão:
1. O `errorInterceptor` captura o evento.
2. Formata a mensagem amigável com base em `message`, `ProblemDetails.detail` ou fallback de rede.
3. Dispara o toast no topo da tela através de `NotificationService.error(...)`.
