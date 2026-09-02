Meu backend é ASP.NET Core + SQL Server.

A Api sempre retorna:

```
Response<T>
{
    message: string;
    dados: T;
}
```
Não utilizar arquitetura legada.
Utilizar Standalone Components, Lazy Loading e Feature-Based Architecture.

Separar o front-end em:

Separar:

- Área Cliente (Storefront)
- Área Administrativa

IMPORTANTE

Este projeto será desenvolvido em etapas.

Nesta primeira entrega:

1. Criar apenas a estrutura de pastas.
2. Criar apenas os layouts principais.
3. Criar apenas os componentes estruturais globais:
   - site-header
   - site-footer
   - main-nav
   - search-bar
   - mini-cart
   - admin-sidebar
   - admin-topbar
   - modal
   - toast-host

4. Criar apenas as rotas iniciais.

NÃO implementar ainda:

- Catálogo de produtos
- Carrinho
- Checkout
- Pedidos
- Wishlist
- Dashboard completo
- Relatórios
- Integrações futuras

Após concluir essa etapa, aguardar próximas instruções para implementação das páginas.


As primeiras funcionalidades que serão implementadas após a arquitetura são:

CLIENTE

- Home
- Meu Perfil
    - Dados pessoais
    - Endereços
    - Alteração de senha

ADMIN

- Listagem de clientes
- Filtro de clientes
- Busca de clientes
- Ativar cliente
- Desativar cliente
- Visualizar detalhes do cliente

As demais páginas serão implementadas posteriormente.

Primeiro defina


Estrutura de pasta a seguir:
- Os diretórios onde não há arquivo implementado, não deverá adicionar arquivos inicialmente, ó com o decorrer do projeto
```text
src/
├── app/
│   ├── core/  # Camada central (Singletons, Auth, State Global, Modelos, etc.)
│   │   ├── api/  # Serviços e configurações base de API / HTTP
│   │   │   ├── api-response.model.ts
│   │   │   ├── api.error.ts
│   │   │   └── api.service.ts
│   │   │   
│   │   ├── auth/  # Gerenciamento de sessão e tokens de autenticação (Vazio pois não haverá persistencia de sessão, nem sessão)
│   │   │   
│   │   │   
│   │   ├── guards/  # Route Guards (proteção de rotas)
│   │   │   ├── admin.guard.ts
│   │   │   └── cart-not-empty.guard.ts
│   │   ├── interceptors/  # Interceptadores HTTP (erros, auth, loading)
│   │   │   ├── api-error.interceptor.ts
│   │   │   └── loading.interceptor.ts
│   │   ├── models/  # Interfaces e tipos de dados do domínio
│   │   │   ├── cart.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── coupon.model.ts
│   │   │   ├── index.ts
│   │   │   ├── money.ts
│   │   │   ├── order.model.ts
│   │   │   └── product.model.ts
│   │   ├── notifications/  # Notificações e feedbacks ao usuário (Toasts)
│   │   │   └── notification.service.ts
│   │   ├── services/  # Serviços utilitários e de infraestrutura
│   │   ├── state/  # Gerenciamento de estado reativo global (Signals / Stores)
│   │   │   └── cart.store.ts
│   │   └── utils/  # Funções utilitárias auxiliares
│   ├── features/  # Módulos funcionais e de negócio da aplicação
│   │   ├── admin/  # Área Administrativa (Painel / Backoffice)
│   │   │   ├── customers/
│   │   │   │   └── pages/
│   │   │   │       └── customer-list-page/
│   │   │   │           └── customer-list-page.component.ts
│   │   │   ├── dashboard/
│   │   │   │   └── pages/
│   │   │   │       └── dashboard-page/
│   │   │   │           ├── dashboard-page.component.html
│   │   │   │           ├── dashboard-page.component.scss
│   │   │   │           └── dashboard-page.component.ts
│   │   │   ├── settings/
│   │   │   ├── shared/  # Componentes e gateways exclusivos do Admin
│   │   │   │   ├── components/
│   │   │   │   │   └── table-toolbar/
│   │   │   │   │       └── table-toolbar.component.ts
│   │   │   │   └── data-access/ (não sei o que faz)
│   │   │   │       ├── admin-http.gateway.ts
│   │   │   │       └── admin.gateway.ts
│   │   │   └── admin.routes.ts
│   │   └── client/  # Área Pública / Loja do Cliente (E-commerce)
│   │       ├── cart/  # Módulo de Carrinho de Compras
│   │       ├── catalog/  # Catálogo, filtros e busca de produtos
│   │       ├── checkout/  # Fluxo de Fechamento de Pedido
│   │       ├── errors/  # Páginas de tratamento de erros
│   │       │   └── not-found-page/
│   │       │       └── not-found-page.component.ts
│   │       ├── home/  # Página Inicial / Vitrine principal
│   │       │   ├── components/
│   │       │   │   ├── hero-banner/
│   │       │   │   │   └── hero-banner.component.ts
│   │       │   │   └── showcase-row/
│   │       │   │       └── showcase-row.component.ts
│   │       │   └── pages/
│   │       │       └── home-page/
│   │       │           ├── home-page.component.html
│   │       │           ├── home-page.component.scss
│   │       │           └── home-page.component.ts
│   │       ├── orders/  # Rastreio e consulta de pedidos
│   │       ├── product/  # Página de Detalhes do Produto (PDP)
│   │       ├── wishlist/  # Lista de Desejos (Favoritos)
│   │       └── client.routes.ts
│   ├── layouts/  # Layouts estruturais da aplicação (Shells)
│   │   ├── admin-layout/  # Shell visual do Admin (Sidebar + Topbar)
│   │   │   ├── components/
│   │   │   │   ├── admin-sidebar/
│   │   │   │   │   └── admin-sidebar.component.ts
│   │   │   │   └── admin-topbar/
│   │   │   │       └── admin-topbar.component.ts /** Barra superior do Admin (toggle do menu + identificacao do operador). */
│   │   │   └── admin-layout.component.ts
│   │   ├── checkout-layout/  # Layout minimalista para Checkout
│   │   └── client-layout/  # Shell visual do E-commerce (Header, Nav, Footer, Mini-cart)
│   │       ├── components/
│   │       │   ├── main-nav/
│   │       │   │   └── main-nav.component.ts /** Navegacao principal alimentada pelas colecoes do catalogo. */
│   │       │   ├── mini-cart/ (Resumo lateral do carrinho, aberto pelo header)
│   │       │   │   └── mini-cart.component.ts
│   │       │   ├── search-bar/
│   │       │   │   └── search-bar.component.ts
│   │       │   ├── site-footer/
│   │       │   │   └── site-footer.component.ts
│   │       │   └── site-header/ /** Header da loja: marca, navegacao, busca, favoritos e mini-carrinho. */
│   │       │       └── site-header.component.ts
│   │       └── client-layout.component.ts /** Moldura da loja: barra de aviso + header + conteudo roteado + rodape. */
│   ├── mocks/  # Gateways e dados mockados para desenvolvimento local
│   │   └── data/  # Massa de dados simulada (JSON/Mocks)
│   ├── shared/  # Recursos reutilizáveis e compartilhados
│   │   ├── directives/  # Diretivas reutilizáveis
│   │   │   └── lazy-img.directive.ts /** Aplica loading/decoding lazy em todas as imagens de catalogo. */
│   │   ├── forms/  # Componentes e validações de formulário
│   │   │   ├── form-field/
│   │   │   │   └── form-field.component.ts /** Label + conteudo + erro: padroniza o espacamento de todos os formularios. */
│   │   │   └── validation-messages.ts /** Fonte unica das mensagens de validacao (evita texto solto por formulario). */
│   │   ├── pipes/  # Pipes de formatação (BRL, truncate)
│   │   └── ui/  # Design System / Componentes visuais reutilizáveis
│   │       ├── alert/
│   │       │   └── alert.component.ts 
│   │       ├── badge/
│   │       │   └── badge.component.ts /** Selo curto: "Novo", "Pre-venda", status de pedido, etc. */
│   │       ├── breadcrumbs/
│   │       │   └── breadcrumbs.component.ts
│   │       ├── button/
│   │       │   ├── button.component.scss
│   │       │   └── button.component.ts /** Botao base do design system (unico lugar que conhece as variantes visuais). */
│   │       ├── card/
│   │       │   └── card.component.ts /** Container visual generico (superficie + borda + padding). */
│   │       ├── data-table/
│   │       │   └── data-table.component.ts /** Tabela generica usada por todas as listagens do Admin. Recebe colunas declarativas para nao replicar markup em cada CRUD. */
│   │       ├── drawer/
│   │       │   └── drawer.component.ts
│   │       ├── empty-state/
│   │       │   └── empty-state.component.ts
│   │       ├── loading-bar/
│   │       │   └── loading-bar.component.ts
│   │       ├── modal/ (Importante para Cadastros e atualização para ter uma modal)
│   │       │   └── modal.component.ts
│   │       ├── pagination/
│   │       │   └── pagination.component.ts
│   │       ├── price/
│   │       │   └── price.component.ts
│   │       ├── section-header/
│   │       │   └── section-header.component.ts
│   │       ├── skeleton/
│   │       │   └── skeleton.component.ts /** Placeholder de carregamento (evita layout shift nas grades). */
│   │       ├── spinner/
│   │       │   └── spinner.component.ts
│   │       └── toast-host/ /** Renderiza os toasts globais. Montado uma unica vez em cada layout. */
│   │           └── toast-host.component.ts 
│   ├── app.config.ts  # Configuração de provedores da aplicação (Standalone)
│   ├── app.routes.ts  # Definição das rotas raiz da aplicação, chama client.routes e admin.routes
│   └── app.ts  # Componente raiz (AppComponent)
├── environments/
│   ├── environment.production.ts
│   └── environment.ts
├── styles/  # Estilos globais e tokens de design (SCSS)
│   ├── _reset.scss  # Reset CSS
│   ├── _tokens.scss  # Design tokens (variáveis, cores, espaçamentos)
│   └── _utilities.scss  # Classes utilitárias auxiliares
├── index.html  # HTML principal de entrada
├── main.ts  # Bootstrap da aplicação Angular
└── styles.scss  # Estilos globais mestres
```

Crie a arquitetura considerando integração futura com os endpoints do backend.

- Não haverá JWT inicialmente
- Não haverá login persistente
- Não haverá sessão complexa

ClienteResponseDto.cs
```
    public class ClienteResponseDto
    {
        public Guid IdCliente { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string CPF { get; set; } = string.Empty;

        public DateTime DataNascimento { get; set; }

        public bool Ativo { get; set; }

        public string Email { get; set; } = string.Empty;

        public Genero Genero { get; set; }

        public string DDD { get; set; } = string.Empty;

        public string Telefone { get; set; } = string.Empty;

        public bool IsAdmin { get; set; }

        public List<EnderecoResponseDto> Enderecos { get; set; } = new();
    }
```

EnderecoResponseDto.cs
```
    public class EnderecoResponseDto
    {
        public uint IdEndereco { get; set; }

        public string Logradouro { get; set; } = string.Empty;

        public uint Numero { get; set; }

        public string Bairro { get; set; } = string.Empty;

        public string? Complemento { get; set; } = string.Empty;

        public string Cep { get; set; } = string.Empty;

        public string Municipio { get; set; } = string.Empty;

        public string UF { get; set; } = string.Empty;

        public bool IsEntrega { get; set; }

        public bool IsCobranca { get; set; }
    }
```

Endpoints existentes da API por enquanto:

Clientes

GET    /api/cliente
GET    /api/cliente/{id}
POST   /api/cliente
PUT    /api/cliente/{id}
DELETE /api/cliente/{id}

GET    /api/cliente/filtro
GET    /api/cliente/search?termo=

PUT    /api/cliente/{id}/alterar-senha
PUT    /api/cliente/{id}/ativar
PUT    /api/cliente/{id}/desativar

Endereços do Cliente

POST   /api/cliente/{id}/enderecos
DELETE /api/cliente/{id}/enderecos/{idEndereco}


Utilize o diretório .agents/skills/ para acessar as skills que requisitado para sse projeto;

Além disso, fazer a leitura do e-commerceDRS.md que é o documento de requisitos do projeto para orientar sobre os requisitos 

Como é um projeto acadêmico e não possuo experiência em frontend, preciso dos comentários  nos arquivos dos códigos para entender melhor o código:

Antes de gerar código:

1. Validar a arquitetura proposta.
2. Explicar a função de cada pasta criada.
3. Explicar quais componentes serão criados nesta etapa.
4. Não avançar para páginas adicionais sem que a etapa atual esteja concluída.

Priorizar entendimento e evolução incremental ao invés de gerar o projeto completo de uma única vez.

Design System:

Paleta principais do projetos (além de alert, error, success padrão):

#FF4885
#CBE2FE
#10288C
#FFE8F0
#4B0090

