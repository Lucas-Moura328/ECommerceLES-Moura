using System.ComponentModel.DataAnnotations;

namespace ECommerceBackend.DTOs.Endereco
{
    public class EnderecoCreateDto
    {
        [Required(ErrorMessage = "O Logradouro é obrigatório.")]
        [StringLength(150, ErrorMessage = "O Logradouro deve ter no máximo 150 caracteres.")]
        public string Logradouro { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Número é obrigatório.")]
        [Range(1, uint.MaxValue, ErrorMessage = "O Número deve ser maior que zero.")]
        public uint Numero { get; set; }

        [Required(ErrorMessage = "O Bairro é obrigatório.")]
        [StringLength(100, ErrorMessage = "O Bairro deve ter no máximo 100 caracteres.")]
        public string Bairro { get; set; } = string.Empty;

      
        [StringLength(60, ErrorMessage = "O Complemento deve ter no máximo 60 caracteres.")]
        public string? Complemento { get; set; } = string.Empty;

        [Required(ErrorMessage = "O CEP é obrigatório.")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "O CEP deve ter 8 caracteres.")]
        public string Cep { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Município é obrigatório.")]
        [StringLength(100, ErrorMessage = "O Município deve ter no máximo 100 caracteres.")]
        public string Municipio { get; set; } = string.Empty;

        [Required(ErrorMessage = "A UF é obrigatória.")]
        [StringLength(2, MinimumLength = 2, ErrorMessage = "A UF deve ter 2 caracteres.")]
        public string UF { get; set; } = string.Empty;

        public bool IsEntrega { get; set; }

        public bool IsCobranca { get; set; }
    }
}
