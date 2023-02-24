using Microsoft.AspNetCore.Mvc;
using EventPlanner.Controllers.Models;
using EventPlanner.Exceptions;
using EventPlanner.Services.AuthenticationServices;
using EventPlanner.Services.AuthorizationService;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IAuthenticationService _authenticationService;
        private IAuthorizationService _authorizationService;
        private IUserService _userService;

        public UserController(
            IAuthenticationService authenticationService,
            IAuthorizationService authorizationService,
            IUserService userService) 
        {
            _authenticationService = authenticationService;
            _authorizationService = authorizationService;
            _userService = userService;
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromForm] string? token)
        {
            throw new NotImplementedException();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                var user = await _authenticationService.LoginAsync(model.Email, model.Password);
                var accessToken = _authorizationService.GetAccessToken(user);
                var refreshToken = await _authorizationService.GetRefreshToken(user);

                return new JsonResult(
                    new {
                        accessToken = accessToken,
                        refreshToken = refreshToken, 
                        user = new {
                            name = user.Name,
                            surname = user.Surname,
                            role = user.Role.Name,
                        }
                    }
                );
            }
            catch (UserNotFoundException)
            {
                return NotFound(new { Errors = new { Email = "Пользователь не найден" } });
            }
            catch (InvalidPasswordException)
            {
                return BadRequest(new { Errors = new { Password = "Неправильный пароль" } });
            }
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