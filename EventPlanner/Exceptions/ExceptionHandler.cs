using Microsoft.AspNetCore.Mvc;

namespace EventPlanner.Exceptions;

public static class ExceptionHandler
{
    public static IActionResult Handle(Exception exception)
    {
        var casted = exception as IActionException<ObjectResult>;
        if (casted != null)
            return casted.FormResponse();

        throw exception;
    }
}
