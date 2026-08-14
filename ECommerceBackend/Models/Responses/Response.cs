using System.Collections.Generic;

namespace ECommerceBackend.Models.Responses
{
    public class Response<T>
    {
        public int StatusCode { get; set; }
        public List<MessagesError> Messages { get; set; }
        public List<T> Dados { get; set; }
        public Response()
        {
            Messages = new List<MessagesError>();
            Dados = new List<T>();
        }
    }
}
