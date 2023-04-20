using Microsoft.AspNetCore.Mvc;

namespace EventPlanner.Exceptions;

public interface IActionException<out T>
    where T : ObjectResult
{
    public IActionResult FormResponse();
}
