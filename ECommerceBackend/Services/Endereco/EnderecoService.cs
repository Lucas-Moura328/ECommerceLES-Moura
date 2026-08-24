using ECommerceBackend.DTOs.Endereco;
using ECommerceBackend.Exceptions;
using ECommerceBackend.Models.Domain;
using ECommerceBackend.Persistence;
using Microsoft.EntityFrameworkCore;
using EnderecoModel = ECommerceBackend.Models.Domain.Endereco;

namespace ECommerceBackend.Services.Endereco
{
    public class EnderecoService : IEnderecoService
    {
        private readonly ECommerceDbContext _context;

        public EnderecoService(ECommerceDbContext context)
        {
            _context = context;
        }

        public async Task AddEndereco(Guid idCliente, EnderecoCreateDto dto)
        {
            ValidarEndereco(dto);

            var clienteExiste = await _context.Clientes
                .AnyAsync(c => c.IdCliente == idCliente);

            if (!clienteExiste)
                throw new NotFoundException("Cliente não encontrado.");


            var endereco = new EnderecoModel
            {
                IdCliente = idCliente,
                Logradouro = dto.Logradouro.Trim(),
                Numero = dto.Numero,
                Bairro = dto.Bairro.Trim(),
                Complemento = dto.Complemento?.Trim(),
                Cep = dto.Cep.Trim(),
                Municipio = dto.Municipio.Trim(),
                UF = dto.UF.Trim().ToUpperInvariant(),
                IsEntrega = dto.IsEntrega,
                IsCobranca = dto.IsCobranca
            };

            if (await _context.Enderecos.AnyAsync(e => e.IdCliente == idCliente && e.Logradouro == endereco.Logradouro && e.Numero == endereco.Numero && e.Bairro == endereco.Bairro && e.Complemento == endereco.Complemento && e.Cep == endereco.Cep && e.Municipio == endereco.Municipio && e.UF == endereco.UF))
                throw new BusinessException("Este endereço já está cadastrado para este cliente.");

            _context.Enderecos.Add(endereco);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEndereco(Guid idCliente, uint idEndereco)
        {
            var endereco = await _context.Enderecos
                .FirstOrDefaultAsync(e =>
                    e.IdEndereco == idEndereco && e.IdCliente == idCliente);

            if (endereco is null)
                throw new NotFoundException("Endereço não encontrado para este cliente.");

            var outrosEnderecos = _context.Enderecos
                .Where(e => e.IdCliente == idCliente && e.IdEndereco != idEndereco);

            if (endereco.IsEntrega &&
                !await outrosEnderecos.AnyAsync(e => e.IsEntrega))
            {
                throw new BusinessException(
                    "Não é possível remover o último endereço de entrega do cliente.");
            }

            if (endereco.IsCobranca &&
                !await outrosEnderecos.AnyAsync(e => e.IsCobranca))
            {
                throw new BusinessException(
                    "Não é possível remover o último endereço de cobrança do cliente.");
            }

            _context.Enderecos.Remove(endereco);
            await _context.SaveChangesAsync();
        }

        private static void ValidarEndereco(EnderecoCreateDto dto)
        {
            if (dto is null)
                throw new BusinessException("O endereço é obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.Logradouro))
                throw new BusinessException("O Logradouro é obrigatório.");

            if (dto.Numero == 0)
                throw new BusinessException("O Número deve ser maior que zero.");

            if (string.IsNullOrWhiteSpace(dto.Bairro))
                throw new BusinessException("O Bairro é obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.Cep))
                throw new BusinessException("O CEP é obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.Municipio))
                throw new BusinessException("O Município é obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.UF))
                throw new BusinessException("A UF é obrigatória.");

            if (!dto.IsEntrega && !dto.IsCobranca)
            {
                throw new BusinessException(
                    "O endereço deve ser de entrega, de cobrança ou ambos.");
            }
        }
    }
}
