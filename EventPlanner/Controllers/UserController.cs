using Microsoft.AspNetCore.Mvc;
using EventPlanner.Controllers.Models;
using EventPlanner.Services.AuthenticationServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IAuthenticationService _authenticationService;
        private IUserService _userService;

        public UserController(IAuthenticationService authenticationService, IUserService userService) 
        {
            _authenticationService = authenticationService;
            _userService = userService;
        }

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

        private async Task<bool> IsEmailUsedAsync(string email)
        {
            return await _userService.GetByEmailAsync(email) != null;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupModel model)
        {
            Console.WriteLine(model);
            if (await IsEmailUsedAsync(model.Email))
                return BadRequest(new { Errors = new { Email = "Данная почта уже используется" } });

            await _authenticationService.RegisterAsync(model.Name, model.Surname, model.Email, model.Password, UserRole.Participant);
            return Ok();
        }
    }
}