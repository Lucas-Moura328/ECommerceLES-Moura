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

            cpf = Regex.Replace(cpf, @"\D", string.Empty);

            if (cpf.Length != 11)
                return new ValidationResult(ErrorMessage ?? "CPF deve conter 11 dígitos.");

            if (cpf.Distinct().Count() == 1)
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");

            var digits = cpf.Select(ch => ch - '0').ToArray();

            
            var firstVerifier = CalcularDigitoVerificador(digits, 9);
            var secondVerifier = CalcularDigitoVerificador(digits, 10);


            if (digits[9] != firstVerifier)
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");
      
            if (digits[10] != secondVerifier)
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");

            return ValidationResult.Success;
        }

        private static int CalcularDigitoVerificador(int[] digits, int length)
        {
            int sum = 0;
            for (int i = 0; i < length; i++)
                sum += digits[i] * (length + 1 - i);
            int remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        }
    }
}
