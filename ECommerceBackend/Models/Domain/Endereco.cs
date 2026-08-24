namespace ECommerceBackend.Models.Domain
{
    public class Endereco
    {
        public uint IdEndereco { get; set; }

        public string Logradouro { get; set; } = string.Empty;

        public uint Numero { get; set; }

        public string Bairro { get; set; } = string.Empty;

        public string? Complemento { get; set; } = string.Empty;

        public string Cep { get; set; } = string.Empty;

        public string Municipio { get; set; } = string.Empty;

        public string UF { get; set; } = string.Empty;

        public bool IsEntrega { get; set; }

        public bool IsCobranca { get; set; }

        public Guid IdCliente { get; set; }

        // Propriedade de navegação para o Cliente
        public Cliente? Cliente { get; set; }
    }
}
