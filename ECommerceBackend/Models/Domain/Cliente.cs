using ECommerceBackend.Models.Enums;

namespace ECommerceBackend.Models.Domain
{
    public class Cliente
    {
        public Guid IdCliente { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CPF { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public string Senha { get; set; } = string.Empty;
        public bool Ativo { get; set; }
        public string Email { get; set; } = string.Empty;
        public Genero Genero { get; set; }
        public string DDD { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;

        //public bool IsLogged { get; set; } Temporário, apenas para controle de login do usuário, futuramente será implementado sistema de autenticação pois parece muita porquisse.
    }
}
