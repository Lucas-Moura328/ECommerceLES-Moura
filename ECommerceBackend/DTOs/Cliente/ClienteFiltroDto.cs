using ECommerceBackend.Models.Enums;

namespace ECommerceBackend.DTOs.Cliente
{
    public class ClienteFiltroDto
    {
        public string? Nome { get; set; }

        public string? CPF { get; set; }

        public string? Email { get; set; }

        public bool? Ativo { get; set; }

        public bool? IsAdmin { get; set; }

        public Genero? Genero { get; set; }
    }
}
