using ECommerceBackend.Models.Enums;

namespace ECommerceBackend.DTOs.ClienteDto
{
    public class ClienteCreateDto
    {
        public string Nome { get; set; } = string.Empty;

        public string CPF { get; set; } = string.Empty;

        public DateTime DataNascimento { get; set; }

        public string Senha { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public Genero Genero { get; set; }

        public string DDD { get; set; } = string.Empty;

        public string Telefone { get; set; } = string.Empty;
    }
}
