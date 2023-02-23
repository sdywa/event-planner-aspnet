using Microsoft.AspNetCore.Mvc;
using EventPlanner.Controllers.Models;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromForm] string? token)
        {
            throw new NotImplementedException();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] LoginModel model)
        {
            throw new NotImplementedException();
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromForm] SignupModel model)
        {
            throw new NotImplementedException();
        }
    }
}