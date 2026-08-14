namespace ECommerceBackend.Models.Responses
{
    public class MessagesError
    {
        public MessagesError()
        {
            CriticalLevel = CriticalLevelLayer.Normal.ToString();
        }

        public string Message { get; set; }
        public string CriticalLevel { get; set; }
    }

    public enum CriticalLevelLayer
    {
        Normal,
        Error,
        FatalError
    }
}
