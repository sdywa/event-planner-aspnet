using Microsoft.AspNetCore.Mvc;

namespace EventPlanner.Exceptions;

public class InvalidRefreshToken : ActionException<BadRequestObjectResult> { }
