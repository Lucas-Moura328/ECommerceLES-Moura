using ECommerceBackend.DTOs.Cliente;
using ECommerceBackend.DTOs.Endereco;

namespace ECommerceBackend.Facade.Cliente
{
    public interface IClienteFacade
    {
        Task<IEnumerable<ClienteResponseDto>> GetAll();
        Task<ClienteResponseDto?> GetById(Guid id);
        Task<ClienteResponseDto> Create(ClienteCreateDto dto);
        Task Update(Guid id, ClienteUpdateDto dto);
        Task Delete(Guid id);
        Task AlterarSenha(Guid id, AlterarSenhaDto dto);
        Task AtivarCliente(Guid id);
        Task DesativarCliente(Guid id);
        Task<IEnumerable<ClienteResponseDto>> GetByFilter(ClienteFiltroDto filtro);
        Task<IEnumerable<ClienteResponseDto>> GetBySearch(string search);

        // Orquestrações envolvendo outros serviços
        Task AddEndereco(Guid idCliente, EnderecoCreateDto dto);
        Task DeleteEndereco(Guid idCliente, uint idEndereco);
        //Task AddCartao(Guid clienteId, CartaoCreateDto dto);
        //Task DeleteCartao(Guid clienteId, Guid cartaoId);


    }
}
