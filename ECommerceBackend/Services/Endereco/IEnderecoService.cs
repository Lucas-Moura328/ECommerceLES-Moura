using ECommerceBackend.DTOs.Endereco;

namespace ECommerceBackend.Services.Endereco
{
    public interface IEnderecoService
    {
        Task AddEndereco(Guid clienteId, EnderecoCreateDto dto);
        Task DeleteEndereco(Guid clienteId, uint idEndereco);
    }
}
