namespace ECommerceBackend.Models.Responses
{
    public class ValidationError
    {
        public string Campo { get; set; } = string.Empty;
        public string Mensagem { get; set; } = string.Empty;
    }
}