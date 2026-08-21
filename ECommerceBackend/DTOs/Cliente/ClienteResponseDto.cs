using ECommerceBackend.DTOs.Endereco;
using ECommerceBackend.Models.Enums;

namespace ECommerceBackend.DTOs.Cliente
{
    public class ClienteResponseDto
    {
        public Guid IdCliente { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string CPF { get; set; } = string.Empty;

        public DateTime DataNascimento { get; set; }

        public bool Ativo { get; set; }

        public string Email { get; set; } = string.Empty;

        public Genero Genero { get; set; }

        public string DDD { get; set; } = string.Empty;

        public string Telefone { get; set; } = string.Empty;

        public bool IsAdmin { get; set; }

        public List<EnderecoResponseDto> Enderecos { get; set; } = new();

    }
}
