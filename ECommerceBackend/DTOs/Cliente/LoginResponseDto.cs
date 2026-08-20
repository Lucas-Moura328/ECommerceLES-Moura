namespace ECommerceBackend.DTOs.Cliente
{
    public class LoginResponseDto
    {
        public Guid IdCliente { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public bool IsAdmin { get; set; }   
    }
}
