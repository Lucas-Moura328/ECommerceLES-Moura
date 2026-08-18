using ECommerceBackend.DTOs.ClienteDto;

namespace ECommerceBackend.Services.ClienteService
{
    public interface IClienteService
    {
        Task<IEnumerable<ClienteResponseDto>> GetAll();

        Task<ClienteResponseDto?> GetById(Guid id);

        Task<ClienteResponseDto> Create(ClienteCreateDto dto);

        Task<bool> Update(Guid id, ClienteUpdateDto dto);

        Task<bool> Delete(Guid id);
    }
}
