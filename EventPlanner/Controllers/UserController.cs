using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Controllers.Models;
using EventPlanner.Exceptions;
using EventPlanner.Models;
using EventPlanner.Services.AuthenticationServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IAuthenticationService _authenticationService;
        private EventPlanner.Services.AuthorizationService.IAuthorizationService _authorizationService;
        private Context _context;
        private IUserService _userService;

        public UserController(
            IAuthenticationService authenticationService,
            EventPlanner.Services.AuthorizationService.IAuthorizationService authorizationService,
            Context context,
            IUserService userService) 
        {
            _authenticationService = authenticationService;
            _authorizationService = authorizationService;
            _context = context;
            _userService = userService;
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenModel? model)
        {
            if (model?.Token == null)
                return BadRequest();

            try {
                var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.RefreshToken)
                .FirstOrDefaultAsync(u => u.RefreshTokenId == model.Token);

                if (user == null)
                    return BadRequest();

                return new JsonResult(
                    await _authorizationService.RefreshTokens(user, model.Token)
                );
            } 
            catch (InvalidRefreshToken)
            {
                return BadRequest();
            }
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

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] TokenModel? model)
        {
            if (model?.Token == null)
                return BadRequest();

            try {
                var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.RefreshToken)
                .FirstOrDefaultAsync(u => u.RefreshTokenId == model.Token);

                if (user == null)
                    return BadRequest();

                await _authorizationService.RemoveRefreshToken(user, model.Token);
                return Ok();
            } 
            catch (InvalidRefreshToken)
            {
                return BadRequest();
            }
        }
    }
}