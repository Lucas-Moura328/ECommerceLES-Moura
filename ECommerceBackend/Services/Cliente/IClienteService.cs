using ECommerceBackend.DTOs.Cliente;

namespace ECommerceBackend.Services.ClienteService
{
    public interface IClienteService
    {
        Task<IEnumerable<ClienteResponseDto>> GetAll();

        Task<ClienteResponseDto?> GetById(Guid id);

        Task<ClienteResponseDto> Create(ClienteCreateDto dto);

        Task Update(Guid id, ClienteUpdateDto dto);

        Task Delete(Guid id);
        Task AlterarSenha(Guid id, AlterarSenhaDto dto);

        Task AtivarCliente(Guid id);

        Task DesativarCliente(Guid id);

    }
}
