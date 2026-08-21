using ECommerceBackend.DTOs.Cliente;
using ECommerceBackend.DTOs.Endereco;
using ECommerceBackend.Services.ClienteService;
using ECommerceBackend.Services.Endereco;

namespace ECommerceBackend.Facade.Cliente
{
    public class ClienteFacade : IClienteFacade
    {
        private readonly IClienteService _clienteService;
        private readonly IEnderecoService _enderecoService;
        //private readonly ICartaoService _cartaoService;

        public ClienteFacade(
            IClienteService clienteService,
            IEnderecoService enderecoService)
        //ICartaoService cartaoService)
        {
            _clienteService = clienteService;
            _enderecoService = enderecoService;
            //_cartaoService = cartaoService;
        }

        public Task<IEnumerable<ClienteResponseDto>> GetAll() => _clienteService.GetAll();

        public Task<ClienteResponseDto?> GetById(Guid id) => _clienteService.GetById(id);

        public Task<ClienteResponseDto> Create(ClienteCreateDto dto) => _clienteService.Create(dto);

        public Task Update(Guid id, ClienteUpdateDto dto) => _clienteService.Update(id, dto);

        public Task Delete(Guid id) => _clienteService.Delete(id);

        public Task AlterarSenha(Guid id, AlterarSenhaDto dto) => _clienteService.AlterarSenha(id, dto);

        public Task AtivarCliente(Guid id) => _clienteService.AtivarCliente(id);

        public Task DesativarCliente(Guid id) => _clienteService.DesativarCliente(id);

        public Task<IEnumerable<ClienteResponseDto>> GetByFilter(ClienteFiltroDto filtro) => _clienteService.GetByFilter(filtro);

        public Task<IEnumerable<ClienteResponseDto>> GetBySearch(string search) => _clienteService.GetBySearch(search);


        // Orquestrações envolvendo outros serviços

        public Task AddEndereco(Guid idCliente, EnderecoCreateDto dto) => _enderecoService.AddEndereco(idCliente, dto);

        public Task DeleteEndereco(Guid idCliente, uint idEndereco) => _enderecoService.DeleteEndereco(idCliente, idEndereco);





        /*public async Task AddCartao(Guid clienteId, CartaoCreateDto dto)
        {
            // Ex.: validar limite, tokenizar cartao via serviço externo...
            await _cartaoService.AddCartao(clienteId, dto);
        }

        public Task DeleteCartao(Guid clienteId, Guid cartaoId)
            => _cartaoService.DeleteCartao(clienteId, cartaoId);*/
    }
}
