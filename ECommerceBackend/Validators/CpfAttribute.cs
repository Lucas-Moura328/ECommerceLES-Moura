using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;

namespace ECommerceBackend.Validators
{
    public class CpfAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var cpf = value as string;
            //if (string.IsNullOrWhiteSpace(cpf))
            //   return new ValidationResult(ErrorMessage ?? "CPF inválido.");

            // Remove não dígitos
            cpf = Regex.Replace(cpf, @"\D", string.Empty);

            if (cpf.Length != 11)
                return new ValidationResult(ErrorMessage ?? "CPF deve conter 11 dígitos.");

            // Rejeita sequências como 00000000000, 11111111111, ...
            if (cpf.Distinct().Count() == 1)
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");

            var digits = cpf.Select(ch => ch - '0').ToArray();

            // Calcula primeiro dígito verificador
            int sum = 0;
            for (int i = 0; i < 9; i++)
                sum += digits[i] * (10 - i);
            int remainder = sum % 11;
            int firstVerifier = remainder < 2 ? 0 : 11 - remainder;
            if (digits[9] != firstVerifier)
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");

            // Calcula segundo dígito verificador
            sum = 0;
            for (int i = 0; i < 10; i++)
                sum += digits[i] * (11 - i);
            remainder = sum % 11;
            int secondVerifier = remainder < 2 ? 0 : 11 - remainder;
            if (digits[10] != secondVerifier)
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");

            return ValidationResult.Success;
        }
    }
}
