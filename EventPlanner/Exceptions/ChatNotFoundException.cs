using Microsoft.AspNetCore.Mvc;

namespace EventPlanner.Exceptions;

public class ChatNotFoundException : ActionException<NotFoundObjectResult>
{
    public ChatNotFoundException(string message = "Чат не найден") : base(message) { }
}
