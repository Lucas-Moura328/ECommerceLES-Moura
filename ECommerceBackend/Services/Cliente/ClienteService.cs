using ECommerceBackend.DTOs.Cliente;
using ECommerceBackend.DTOs.Endereco;
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
            var clientes = await _context.Clientes.AsNoTracking().ToListAsync();

            return clientes.Select(CriarRespostaCliente).ToList();
        }

        public async Task<ClienteResponseDto?> GetById(Guid id)
        {
            var cliente = await _context.Clientes.AsNoTracking().Include(c => c.Enderecos).FirstOrDefaultAsync(c => c.IdCliente == id);

            if (cliente == null)
                return null;

            return CriarRespostaCliente(cliente);
        }

        public async Task<ClienteResponseDto> Create(ClienteCreateDto dto)
        {
            ValidarDataNascimento(dto.DataNascimento);

            await ValidarUnicidadeAsync(dto.CPF, dto.Email, dto.DDD, dto.Telefone);

            var cliente = new Cliente
            {
                IdCliente = Guid.NewGuid(),
                Nome = dto.Nome,
                CPF = dto.CPF,
                DataNascimento = dto.DataNascimento,
                Email = dto.Email.Trim().ToLowerInvariant(),
                Genero = dto.Genero,
                DDD = dto.DDD,
                Telefone = dto.Telefone,
                Ativo = true,
                IsAdmin = false
            };

            cliente.Senha = _passwordHasher.HashPassword(cliente, dto.Senha);

            _context.Clientes.Add(cliente);

            await _context.SaveChangesAsync();

            return CriarRespostaCliente(cliente);
        }

        public async Task Update(Guid id, ClienteUpdateDto dto)
        {
            var cliente = await ObterClientePorId(id);

            ValidarDataNascimento(dto.DataNascimento);

            await ValidarUnicidadeAsync(dto.CPF, dto.Email, dto.DDD, dto.Telefone, id);

            cliente.Nome = dto.Nome;
            cliente.CPF = dto.CPF;
            cliente.DataNascimento = dto.DataNascimento;
            cliente.Email = dto.Email.Trim().ToLowerInvariant();
            cliente.Genero = dto.Genero;
            cliente.DDD = dto.DDD;
            cliente.Telefone = dto.Telefone;

            await _context.SaveChangesAsync();

        }

        public async Task Delete(Guid id)
        {
            var cliente = await ObterClientePorId(id);

            _context.Clientes.Remove(cliente);

            await _context.SaveChangesAsync();
        }

        public async Task AlterarSenha(Guid id, AlterarSenhaDto dto)
        {
            var cliente = await ObterClientePorId(id);


            PasswordVerificationResult resultadoVerificacaoSenha = _passwordHasher.VerifyHashedPassword(cliente, cliente.Senha, dto.SenhaAtual);

            if (resultadoVerificacaoSenha != PasswordVerificationResult.Success)                                                                    //if (!_passwordHasher.VerifyHashedPassword(cliente, cliente.Senha, dto.SenhaAtual).Equals(PasswordVerificationResult.Success))
                throw new BusinessException("Senha atual incorreta.");                                                                              //    throw new BusinessException("Senha atual incorreta."); --- Semântica mais dificil de entender, então preferi criar uma variável para armazenar o resultado da verificação da senha.


            cliente.Senha = _passwordHasher.HashPassword(cliente, dto.Senha);

            await _context.SaveChangesAsync();

        }

        public async Task AtivarCliente(Guid id)
        {
            var cliente = await ObterClientePorId(id);

            if (cliente.Ativo)
                throw new BusinessException("Cliente já está ativo.");

            cliente.Ativo = !cliente.Ativo;

            await _context.SaveChangesAsync();
        }

        public async Task DesativarCliente(Guid id)
        {
            var cliente = await ObterClientePorId(id);

            if (!cliente.Ativo)
                throw new BusinessException("Cliente já está desativado.");

            cliente.Ativo = !cliente.Ativo;

            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<ClienteResponseDto>> GetByFilter(ClienteFiltroDto filtro)
        {
            IQueryable<Cliente> query = _context.Clientes;

            if (!string.IsNullOrWhiteSpace(filtro.Nome))
                query = query.Where(c =>c.Nome.Contains(filtro.Nome));
            

            if (!string.IsNullOrWhiteSpace(filtro.CPF))
                query = query.Where(c =>c.CPF.Contains(filtro.CPF));
            
            if (!string.IsNullOrWhiteSpace(filtro.Email))
                query = query.Where(c =>c.Email.Contains(filtro.Email));
            
            if (filtro.Ativo.HasValue)
                query = query.Where(c =>c.Ativo == filtro.Ativo.Value);

            if (filtro.IsAdmin.HasValue)
                query = query.Where(c =>c.IsAdmin == filtro.IsAdmin.Value);

            if (filtro.Genero.HasValue)
                query = query.Where(c =>c.Genero == filtro.Genero.Value);

            var clientes = await query.ToListAsync();

            return clientes.Select(CriarRespostaCliente).ToList();
        }

        public async Task<IEnumerable<ClienteResponseDto>> GetBySearch(string search)
        {
            if (string.IsNullOrWhiteSpace(search))
                return await GetAll();

            var clientes = await _context.Clientes
                .Where(c =>
                    c.Nome.Contains(search) ||
                    c.Email.Contains(search) ||
                    c.CPF.Contains(search) ||
                    c.Telefone.Contains(search))
                .ToListAsync();

            return clientes.Select(CriarRespostaCliente).ToList();
        }


        //Métodos privados 

        private async Task<Cliente> ObterClientePorId(Guid id)
        {
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.IdCliente == id);

            if (cliente == null)
                throw new NotFoundException("Cliente não encontrado.");

            return cliente;
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

        private static void ValidarDataNascimento(DateTime dataNascimento)
        {
            if (dataNascimento.Date > DateTime.Today)
            {
                throw new BusinessException(
                    "A data de nascimento não pode ser posterior à data atual.");
            }
        }

        private static ClienteResponseDto CriarRespostaCliente(Cliente cliente)
        {
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
                IsAdmin = cliente.IsAdmin,

                Enderecos = cliente.Enderecos
                .Select(e => new EnderecoResponseDto
                {
                    IdEndereco = e.IdEndereco,
                    Cep = e.Cep,
                    Logradouro = e.Logradouro,
                    Numero = e.Numero,
                    Bairro = e.Bairro,
                    Municipio = e.Municipio,
                    UF = e.UF,
                    IsEntrega = e.IsEntrega,
                    IsCobranca = e.IsCobranca
                }).ToList()
            };
        }

    }
}