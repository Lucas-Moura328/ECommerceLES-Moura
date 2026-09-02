# E-Commerce de camisetas

## Visão Geral

Sistema de e-commerce para venda de camisetas com gerenciamento de catálogo, clientes, estoque, vendas, trocas, cupons, análises gerenciais e recomendações baseadas em IA.

---

# Objetivos do Sistema

- Gerenciar catálogo de camisetas.
- Gerenciar clientes.
- Controlar estoque.
- Realizar vendas online.
- Gerenciar trocas.
- Gerar cupons promocionais e de troca.
- Disponibilizar dashboards gerenciais.
- Oferecer recomendações personalizadas através de IA.

---

# Perfis de Usuário

## Cliente

Pode:

- Consultar camisetas.
- Realizar cadastro.
- Gerenciar endereços.
- Gerenciar cartões.
- Realizar compras.
- Solicitar trocas.
- Consultar histórico de compras.

## Administrador

Pode:

- Gerenciar catálogo.
- Gerenciar estoque.
- Aprovar processos de troca.
- Atualizar status de pedidos.
- Visualizar análises gerenciais.
- Gerenciar vendas.

---

# Domínio do Sistema

## camiseta

### Campos obrigatórios

- Autor
- Categoria
- Ano
- Título
- Editora
- Edição
- ISBN
- Número de páginas
- Sinopse
- Altura
- Largura
- Peso
- Profundidade
- Grupo de precificação
- Código de barras

### Regras


- Toda camiseta possui código único.
- Toda camiseta deve estar vinculado a um grupo de precificação.

---

## Cliente

### Campos obrigatórios

- Gênero
- Nome
- Data de nascimento
- CPF
- Telefone
- E-mail
- Senha
- Endereço endereços(um cliente possui N endereços)
- Cartão (um cliente possui N Cartões)

### Regras

- Cliente recebe código único.
- Cliente possui ranking baseado em compras.
- Senha deve ser criptografada (já existe no backend).

---

## Endereço

### Campos

- Tipo de residência (boolean no backend: bool isEntrega, bool isCobranca)
- Logradouro
- Número
- Bairro
- CEP
- Cidade
- Estado
- País
- Observação (opcional)

### Regras

- Cliente deve possuir ao menos:
  - 1 endereço de cobrança
  - 1 endereço de entrega
(Na qual um endereço pode cobrir os dois)
---

## Cartão de Crédito

### Campos

- Número do cartão
- Nome impresso
- Bandeira
- Código de segurança

### Regras

- Bandeira deve existir no sistema.
- Cliente pode possuir múltiplos cartões.
- Deve existir um cartão preferencial.

---

# Módulo de camisetas

## Funcionalidades

### RF0011
Cadastrar camiseta

### RF0012
Inativar camiseta

### RF0013
Inativação automática

Condição:

- Sem estoque
- Sem vendas acima do valor mínimo parametrizado

### RF0014
Alterar camiseta

### RF0015
Consultar camisetas

Filtros:

- Qualquer campo
- Filtros combinados

### RF0016
Ativar camiseta

---

# Regras de Negócio dos camisetas

## RN0013

Valor de venda:

```
Valor Venda =
Valor Custo +
Percentual Grupo Precificação
```

## RN0014

Não permitir margem abaixo do mínimo sem autorização gerencial.

## RN0015

Inativação manual exige:

- Justificativa
- Categoria

## RN0016

Inativação automática:

Categoria = FORA_DE_MERCADO

## RN0017

Ativação exige:

- Justificativa
- Categoria

---

# Módulo de Clientes

## Funcionalidades

### RF0021
Cadastrar cliente

### RF0022
Alterar cliente

### RF0023
Inativar cliente

### RF0024
Consultar clientes

### RF0025
Consultar histórico de transações

### RF0026
Gerenciar endereços

### RF0027
Gerenciar cartões

### RF0028
Alterar senha

---

# Módulo de Carrinho

## RF0031

Gerenciar carrinho

Permitir:

- Adicionar item
- Alterar item
- Remover item
- Visualizar carrinho

## RF0032

Alterar quantidade

---

# Módulo de Compra

## RF0033

Realizar compra

## RF0034

Calcular frete

Baseado em:

- Itens
- Endereço

## RF0035

Selecionar endereço

Pode:

- Utilizar endereço existente
- Cadastrar novo

## RF0036

Selecionar pagamento

Pode:

- Utilizar cartão existente
- Cadastrar novo
- Utilizar cupom

## RF0037

Pagamento com:

- Cartão
- Cupom promocional
- Cupom de troca

## RF0038

Finalizar compra

Status inicial:

```
EM_PROCESSAMENTO
```

---

# Fluxo de Aprovação

## RN0037

Validar:

- Cartões
- Cupons

## RN0038

Sucesso:

```
APROVADA
```

Falha:

```
REPROVADA
```

---

# Fluxo de Entrega

## RF0039

Despachar pedido

Status:

```
EM_TRANSPORTE
```

## RF0040

Confirmar entrega

Status:

```
ENTREGUE
```

---

# Fluxo de Trocas

## RF0041

Solicitar troca

## RF0042

Autorizar troca

Status:

```
TROCA_AUTORIZADA
```

## RF0043

Visualizar trocas

## RF0044

Confirmar recebimento

Administrador informa:

- Retorna ao estoque?
  - Sim
  - Não

## RF0045

Gerar cupom de troca

---

# Regras de Compra

## RN0031

Não permitir compra sem estoque.

## RN0032

Caso estoque altere:

- Notificar usuário
- Atualizar carrinho
- Remover indisponíveis

## RN0033

Máximo:

```
1 cupom promocional por compra
```

## RN0034

Múltiplos cartões permitidos.

Valor mínimo:

```
R$ 10,00 por cartão
```

## RN0035

Cupons possuem prioridade sobre cartão.

## RN0036

Gerar cupom de troco quando houver excedente.

---

# Controle de Estoque

## RF0051

Entrada de estoque

Campos:

- camiseta
- Quantidade

## RF0052

Calcular valor de venda

Base:

- Valor custo
- Grupo precificação

## RF0053

Baixa automática após venda

## RF0054

Reentrada por troca

---

# Regras de Estoque

## RN0050

Obrigatório informar:

- Produto
- Quantidade
- Valor custo
- Fornecedor
- Data entrada

## RN0051

Se houver custos diferentes:

Utilizar maior custo para cálculo do preço.

## RN0061

Quantidade > 0

## RN0062

Valor custo obrigatório

## RN0064

Data entrada obrigatória

---

# Módulo de Análise

## RF0055

Analisar histórico de vendas

Filtros:

- Data inicial
- Data final
- Categoria

## RF0056

Filtrar período

Validação:

```
DataFim >= DataInicio
```

## RF0057

Comparar categorias

## RF0058

Exportar planilha

---

# Regras de Análise

## RN0071

Agrupamento mensal.

## RN0072

Período:

- Mínimo: 1 mês
- Máximo: 24 meses

## RN0073

Categoria sem venda:

```
Valor = R$ 0,00
```

## RN0074

Status considerados:

- APROVADA
- EM_TRANSPORTE
- ENTREGUE

Status ignorados:

- REPROVADA
- CANCELADA

---

# Requisitos Não Funcionais

## Performance

### RNF0011

Tempo máximo:

```
1 segundo
```

para consultas.

---

## Auditoria

### RNF0012

Registrar:

- Data
- Hora
- Usuário
- Alterações

---

## Segurança

### RNF0031

Senha forte:

- 8 caracteres
- Maiúscula
- Minúscula
- Especial

### RNF0032

Confirmação de senha

### RNF0033

Senha criptografada

---

# Dashboard Gerencial

## RNF0043

Gráfico de linhas

### Eixo X

Mês/Ano

### Eixo Y

Valor em reais

### Linha

Uma por categoria

## RNF0044

Formato monetário brasileiro

Exemplo:

```
R$ 20.000,00
```

## RNF0045

Legenda por categoria

## RNF0046

Tooltip com valor exato

---

# Inteligência Artificial

## RNF IA

### Recomendação personalizada

Objetivos:

- Recomendar camisetas.
- Utilizar histórico de compras.
- Utilizar preferências do cliente.

### Chatbot

Funções:

- Responder dúvidas.
- Sugerir camisetas.
- Auxiliar navegação.

### Aprendizado

Baseado em:

- Histórico de vendas
- Feedback de clientes
- Preferências registradas

---

# Status de Pedido

```text
EM_PROCESSAMENTO
APROVADA
REPROVADA
EM_TRANSPORTE
ENTREGUE
EM_TROCA
TROCA_AUTORIZADA
TROCADO
```

---

# Entidades Principais

```text
camiseta
-Cor
-Preço
-Tamanho
-Quantidade
-coleção (categoria)



Cliente
Endereco
CartaoCredito

Carrinho
CarrinhoItem

Pedido
PedidoItem

Pagamento
CupomTroca
CupomPromocional

MovimentacaoEstoque

SolicitacaoTroca

AnaliseVendas
```