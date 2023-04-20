using Microsoft.AspNetCore.Mvc;

namespace EventPlanner.Exceptions;

public class EventNotFoundException : ActionException<NotFoundObjectResult>
{
    public EventNotFoundException(string message = "Мероприятие не найдено") : base(message) { }
}
