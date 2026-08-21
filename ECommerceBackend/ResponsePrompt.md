Sim. Quando você começar a adicionar relacionamentos, sua arquitetura vai mudar um pouco, principalmente porque o Cliente deixará de ser uma entidade isolada.

No seu exemplo:

Cliente
 ├── Endereços
 └── Cartões

Eu não colocaria tudo dentro do ClienteService. Esse é um ponto importante.

1. Modelagem das entidades

Por exemplo:

public class Cliente
{
    public Guid IdCliente { get; set; }


    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;


    public ICollection<Endereco> Enderecos { get; set; }
        = new List<Endereco>();


    public ICollection<Cartao> Cartoes { get; set; }
        = new List<Cartao>();
}

E:

public class Endereco
{
    public Guid IdEndereco { get; set; }


    public string CEP { get; set; } = string.Empty;
    public string Logradouro { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;


    public Guid IdCliente { get; set; }


    public Cliente Cliente { get; set; } = null!;
}

Cartão:

public class Cartao
{
    public Guid IdCartao { get; set; }


    public string NomeTitular { get; set; } = string.Empty;
    public string UltimosDigitos { get; set; } = string.Empty;


    public Guid IdCliente { get; set; }


    public Cliente Cliente { get; set; } = null!;
}

Isso representa:

Cliente 1 ──────── N Endereco
       │
       └────────── N Cartao
2. Não faria tudo pelo ClienteService

Um erro comum seria fazer:

ClienteService
│
├── CriarCliente()
├── AlterarCliente()
├── CriarEndereco()
├── AlterarEndereco()
├── ExcluirEndereco()
├── CriarCartao()
├── AlterarCartao()
├── ExcluirCartao()
└── ...

Conforme o projeto cresce, isso vira um serviço gigantesco.

Eu separaria:

Services/
│
├── ClienteService/
│   ├── IClienteService.cs
│   └── ClienteService.cs
│
├── EnderecoService/
│   ├── IEnderecoService.cs
│   └── EnderecoService.cs
│
└── CartaoService/
    ├── ICartaoService.cs
    └── CartaoService.cs

Assim:

ClienteService
    → regras do Cliente


EnderecoService
    → regras do Endereço


CartaoService
    → regras do Cartão
3. Como ficam os endpoints?

Eu usaria recursos aninhados quando fizer sentido.

Por exemplo:

GET /api/clientes/{clienteId}/enderecos

Para buscar os endereços daquele cliente.

Criar:

POST /api/clientes/{clienteId}/enderecos

Atualizar:

PUT /api/clientes/{clienteId}/enderecos/{enderecoId}

Excluir:

DELETE /api/clientes/{clienteId}/enderecos/{enderecoId}

Ficaria:

/api/clientes
    │
    └── /{clienteId}
          │
          └── /enderecos
                 ├── GET
                 ├── POST
                 └── /{enderecoId}
                       ├── PUT
                       └── DELETE

Para cartões:

/api/clientes/{clienteId}/cartoes
4. E o ClienteResponseDto?

Aqui está uma decisão importante.

Você não necessariamente deve retornar tudo sempre.

Por exemplo, seu:

ClienteResponseDto

poderia continuar representando apenas os dados básicos:

public class ClienteResponseDto
{
    public Guid IdCliente { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;


    // ...
}

E criar um DTO específico para quando precisar retornar o cliente completo:

public class ClienteDetalhadoResponseDto
{
    public Guid IdCliente { get; set; }
    public string Nome { get; set; } = string.Empty;


    public IEnumerable<EnderecoResponseDto> Enderecos { get; set; }
        = [];


    public IEnumerable<CartaoResponseDto> Cartoes { get; set; }
        = [];
}

Assim você pode ter:

GET /api/clientes

retornando uma lista leve.

E:

GET /api/clientes/{id}/detalhado

ou simplesmente o GetById retornando os dados necessários, dependendo dos requisitos.

5. Cuidado com Include

No EF Core você poderia fazer:

var cliente = await _context.Clientes
    .Include(c => c.Enderecos)
    .Include(c => c.Cartoes)
    .FirstOrDefaultAsync(c => c.IdCliente == id);

Isso permite carregar:

Cliente
 ├── Endereços
 └── Cartões

Mas não use Include automaticamente em todos os métodos.

Imagine seu GetAll():

_context.Clientes
    .Include(c => c.Enderecos)
    .Include(c => c.Cartoes)
    .ToListAsync();

Se você tiver 10.000 clientes, cada um com vários endereços e cartões, pode acabar trazendo uma quantidade enorme de dados desnecessariamente.

Para listagens, normalmente é melhor fazer uma projeção diretamente para DTO.

6. Um ponto ainda mais importante: cartão

Aqui eu faria uma ressalva de segurança.

Você falou em:

Cliente
 └── List<Cartao>

Se estiver falando de cartão de crédito real, não é uma boa ideia armazenar número completo, CVV etc. no banco da sua aplicação.

Em um projeto acadêmico você pode modelar a entidade, mas em uma aplicação real normalmente o pagamento é delegado a um gateway/provedor, e sua aplicação guarda apenas informações permitidas, como:

Últimos 4 dígitos
Bandeira
Token do cartão
Identificador no gateway
Data de expiração (conforme o provedor)

Nunca trate o CVV como um dado comum persistido.

7. E onde entram as regras de negócio?

Agora começa a ficar interessante.

Imagine:

Cliente
CPF deve ser único
Email deve ser único
Data de nascimento não pode ser futura

→ ClienteService

Endereço
CEP obrigatório
Número obrigatório
Cliente deve existir
Limite de endereços
Apenas um endereço principal

→ EnderecoService

Cartão
Cliente deve existir
Não permitir cartão duplicado
Limite de cartões

→ CartaoService

Cada serviço cuida das regras da sua entidade.

8. E se eu precisar criar Cliente + Endereço juntos?

Aí entra um caso onde Facade pode começar a fazer sentido, justamente conectando com sua pergunta anterior.

Imagine:

POST /api/clientes

e o cadastro recebe:

Cliente
+ Endereço principal

Você poderia ter:

ClienteController
       ↓
ClienteFacade
       ↓
 ┌─────┴─────┐
 ↓           ↓
Cliente    Endereco
Service    Service

A Facade coordena a operação.

Isso evita colocar no ClienteService toda a responsabilidade de orquestrar outros serviços.

9. E transação?

Imagine:

Criar Cliente
     ↓
Criar Endereço
     ↓
Criar Cartão

Se acontecer:

Cliente → OK
Endereço → OK
Cartão → ERRO

Você pode acabar com dados parcialmente criados.

Nesse tipo de operação, você pode utilizar uma transação do EF Core para garantir atomicidade:

BEGIN TRANSACTION


Criar Cliente
Criar Endereço
Criar Cartão


       ↓


Tudo OK → COMMIT


ou


Algum erro → ROLLBACK

Mas isso é algo que eu adicionaria quando surgir realmente uma operação envolvendo várias entidades.

Para o seu projeto, eu seguiria esta evolução

Você está atualmente aqui:

Cliente
   ↓
ClienteService
   ↓
DbContext

Próximo passo:

Cliente
   ├── Endereco
   └── Cartao

Com:

ClienteService
EnderecoService
CartaoService

E seus respectivos Controllers/DTOs.

Depois, quando aparecerem operações que envolvam várias entidades ao mesmo tempo:

Checkout
   ↓
Cliente
Estoque
Pedido
Pagamento
Endereco

aí você pode introduzir uma Facade/serviço de aplicação para orquestrar o processo, além de transações quando necessário.

Essa abordagem evita tanto o "Service Deus" (ClienteService fazendo tudo) quanto o overengineering de criar Facade, Strategy, Repository etc. antes de o projeto realmente precisar deles.