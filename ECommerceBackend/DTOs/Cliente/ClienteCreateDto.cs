using ECommerceBackend.Models.Enums;
using System.ComponentModel.DataAnnotations;
using ECommerceBackend.Validators;

namespace ECommerceBackend.DTOs.Cliente
{
    public class ClienteCreateDto
    {
        [Required(ErrorMessage = "O Nome é obrigatório.")]
        [StringLength(150, ErrorMessage = "O Nome deve ter no máximo 150 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O CPF é obrigatório.")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "O CPF deve ter 11 caracteres.")]
        [Cpf(ErrorMessage = "O CPF informado é inválido.")]
        public string CPF { get; set; } = string.Empty;

        [Required(ErrorMessage = "A Data de Nascimento é obrigatória.")]
        public DateTime DataNascimento { get; set; }

        [Required(ErrorMessage = "A Senha é obrigatória.")]
        [StringLength(255, ErrorMessage = "A Senha deve ter no máximo 255 caracteres.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,255}$",
            ErrorMessage = "A Senha deve ter pelo menos 8 caracteres, conter letras maiúsculas, minúsculas e ao menos um caractere especial.")]
        public string Senha { get; set; } = string.Empty;


        [Required(ErrorMessage = "A Confirmação de Senha é obrigatória.")]
        [Compare("Senha", ErrorMessage = "A confirmação de senha não corresponde à senha informada.")]
        public string ConfirmSenha { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Email é obrigatório.")]
        [EmailAddress(ErrorMessage = "O Email deve ser um endereço de email válido.")]
        [StringLength(150, ErrorMessage = "O Email deve ter no máximo 150 caracteres.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Gênero é obrigatório.")]
        public Genero Genero { get; set; }

        [Required(ErrorMessage = "O DDD é obrigatório.")]
        [StringLength(2, MinimumLength = 2, ErrorMessage = "O DDD deve ter 2 caracteres.")]
        public string DDD { get; set; } = string.Empty;

        [Required]
        [StringLength(9, MinimumLength = 8)]
        public string Telefone { get; set; } = string.Empty;
    }
}
