using ECommerceBackend.DTOs.ClienteDto;
using ECommerceBackend.Exceptions;
using ECommerceBackend.Models.Domain;
using ECommerceBackend.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECommerceBackend.Services.ClienteService
{
    public class ClienteService : IClienteService
    {
        private readonly ECommerceDbContext _context;
        private readonly PasswordHasher<Cliente> _passwordHasher = new();

        public ClienteService(ECommerceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ClienteResponseDto>> GetAll()
        {
            var clientes = await _context.Clientes
                .ToListAsync();

            return clientes.Select(cliente => new ClienteResponseDto
            {
                IdCliente = cliente.IdCliente,
                Nome = cliente.Nome,
                CPF = cliente.CPF,
                DataNascimento = cliente.DataNascimento,
                Ativo = cliente.Ativo,
                Email = cliente.Email,
                Genero = cliente.Genero,
                DDD = cliente.DDD,
                Telefone = cliente.Telefone,
                IsAdmin = cliente.IsAdmin
            }).ToList();
        }

        public async Task<ClienteResponseDto?> GetById(Guid id)
        {
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.IdCliente == id);

            if (cliente == null)
                return null;

            return new ClienteResponseDto
            {
                IdCliente = cliente.IdCliente,
                Nome = cliente.Nome,
                CPF = cliente.CPF,
                DataNascimento = cliente.DataNascimento,
                Ativo = cliente.Ativo,
                Email = cliente.Email,
                Genero = cliente.Genero,
                DDD = cliente.DDD,
                Telefone = cliente.Telefone,
                IsAdmin = cliente.IsAdmin
            };
        }

        public async Task<ClienteResponseDto> Create(ClienteCreateDto dto)
        {
            await ValidarUnicidadeAsync(dto.CPF, dto.Email, dto.DDD, dto.Telefone);

            var cliente = new Cliente
            {
                IdCliente = Guid.NewGuid(),
                Nome = dto.Nome,
                CPF = dto.CPF,
                DataNascimento = dto.DataNascimento,
                Email = dto.Email,
                Genero = dto.Genero,
                DDD = dto.DDD,
                Telefone = dto.Telefone,
                Ativo = true,
                IsAdmin = false
            };

            cliente.Senha = _passwordHasher.HashPassword(cliente, dto.Senha);

            _context.Clientes.Add(cliente);

            await _context.SaveChangesAsync();

            return new ClienteResponseDto
            {
                IdCliente = cliente.IdCliente,
                Nome = cliente.Nome,
                CPF = cliente.CPF,
                DataNascimento = cliente.DataNascimento,
                Ativo = cliente.Ativo,
                Email = cliente.Email,
                Genero = cliente.Genero,
                DDD = cliente.DDD,
                Telefone = cliente.Telefone,
                IsAdmin = cliente.IsAdmin
            };
        }

        public async Task<bool> Update(Guid id, ClienteUpdateDto dto)
        {
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.IdCliente == id);

            if (cliente == null)
                return false;


            await ValidarUnicidadeAsync(dto.CPF, dto.Email, dto.DDD, dto.Telefone, id);

            cliente.Nome = dto.Nome;
            cliente.CPF = dto.CPF;
            cliente.DataNascimento = dto.DataNascimento;
            cliente.Email = dto.Email;
            cliente.Genero = dto.Genero;
            cliente.DDD = dto.DDD;
            cliente.Telefone = dto.Telefone;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Delete(Guid id)
        {
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.IdCliente == id);

            if (cliente == null)
                return false;

            _context.Clientes.Remove(cliente);

            await _context.SaveChangesAsync();

            return true;
        }

        private async Task ValidarUnicidadeAsync(
            string cpf,
            string email,
            string ddd,
            string telefone,
            Guid? idCliente = null)
        {
            if (await _context.Clientes.AnyAsync(c => c.CPF == cpf && (idCliente == null || c.IdCliente != idCliente)))
            {
                throw new BusinessException("CPF já cadastrado.");
            }

            if (await _context.Clientes.AnyAsync(c => c.Email == email && (idCliente == null || c.IdCliente != idCliente)))
            {
                throw new BusinessException("E-mail já cadastrado.");
            }

            if (await _context.Clientes.AnyAsync(c => c.DDD == ddd && c.Telefone == telefone && (idCliente == null || c.IdCliente != idCliente)))
            {
                throw new BusinessException("Telefone já cadastrado.");
            }
        }
    }
}