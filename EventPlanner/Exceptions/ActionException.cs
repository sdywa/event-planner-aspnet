using Microsoft.AspNetCore.Mvc;

namespace EventPlanner.Exceptions;

public class ActionException<T> : Exception, IActionException<T>
    where T : ObjectResult
{
    public string? PropertyName { get; set; }

    public ActionException()
        : base() { }

    public ActionException(string? message)
        : base(message) { }

    public IActionResult FormResponse()
    {
        var key = "message";
        if (PropertyName != null)
            key = PropertyName;

        object errors = new Dictionary<string, string> { [key] = Message };
        var instance = Activator.CreateInstance(typeof(T), new { errors }) as T;
        if (instance == null)
            throw new InvalidCastException();
        return instance;
    }
}
