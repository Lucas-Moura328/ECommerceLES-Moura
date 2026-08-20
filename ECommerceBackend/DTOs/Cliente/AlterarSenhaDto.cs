using System.ComponentModel.DataAnnotations;

namespace ECommerceBackend.DTOs.Cliente
{
    public class AlterarSenhaDto
    {
        [Required(ErrorMessage = "A Senha Atual é obrigatória.")]
        [StringLength(255, ErrorMessage = "A Senha Atual deve ter no máximo 255 caracteres.")]
        public string SenhaAtual { get; set; } = string.Empty;

        [Required(ErrorMessage = "A Senha é obrigatória.")]
        [StringLength(255, ErrorMessage = "A Senha deve ter no máximo 255 caracteres.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,255}$",
            ErrorMessage = "A Senha deve ter pelo menos 8 caracteres, conter letras maiúsculas, minúsculas e ao menos um caractere especial.")]
        public string Senha { get; set; } = string.Empty;


        [Required(ErrorMessage = "A Confirmação de Senha é obrigatória.")]
        [Compare("Senha", ErrorMessage = "A confirmação de senha não corresponde à senha informada.")]
        public string ConfirmSenha { get; set; } = string.Empty;
    }
}
