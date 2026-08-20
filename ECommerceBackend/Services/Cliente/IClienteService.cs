using ECommerceBackend.DTOs.Cliente;

namespace ECommerceBackend.Services.ClienteService
{
    public interface IClienteService
    {
        Task<IEnumerable<ClienteResponseDto>> GetAll(Guid idClienteLogado);

        Task<ClienteResponseDto?> GetById(Guid id);

        Task<ClienteResponseDto> Create(ClienteCreateDto dto);

        Task Update(Guid id, ClienteUpdateDto dto);

        Task Delete(Guid id);
        Task AlterarSenha(Guid id, AlterarSenhaDto dto);

        Task AtivarCliente(Guid id);

        Task DesativarCliente(Guid id);

        Task<LoginResponseDto> Login(LoginDto dto);

        Task<bool> Logout(Guid id);
    }
}
