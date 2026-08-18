using System.Collections.Generic;

namespace ECommerceBackend.Models.Responses
{
    public class Response<T>
    {
        public string? Message { get; set; }
        public T? Dados { get; set; }
        
    }
}
