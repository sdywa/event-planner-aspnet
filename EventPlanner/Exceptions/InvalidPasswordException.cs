using Microsoft.AspNetCore.Mvc;

namespace EventPlanner.Exceptions;

public class InvalidPasswordException : ActionException<BadRequestObjectResult>
{
    public InvalidPasswordException(string message = "Неверный пароль")
        : base(message) { }
}
