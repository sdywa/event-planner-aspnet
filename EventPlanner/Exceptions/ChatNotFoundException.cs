using Microsoft.AspNetCore.Mvc;

namespace EventPlanner.Exceptions;

public class ChatNotFoundException : ActionException<NotFoundObjectResult>
{
    public ChatNotFoundException(string message = "Мероприятие не найдено") : base(message) { }
}
