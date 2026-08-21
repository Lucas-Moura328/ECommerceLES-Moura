using ECommerceBackend.DTOs.Endereco;
using ECommerceBackend.Exceptions;

namespace ECommerceBackend.Services.Endereco
{
    public class EnderecoService : IEnderecoService
    {
        public Task AddEndereco(Guid idCliente, EnderecoCreateDto dto)
        {
            throw new BusinessException("Método AddEndereco não implementado.");
        }

        public Task DeleteEndereco(Guid idCliente, uint idEndereco)
        {
            throw new BusinessException("Método DeleteEndereco não implementado.");
        }
    }
}
