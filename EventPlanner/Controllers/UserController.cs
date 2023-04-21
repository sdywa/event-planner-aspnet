using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
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
                            id = user.Id,
                            email = user.Email,
                            name = user.Name,
                            surname = user.Surname,
                            role = user.Role.Name,
                        }
                    }
                );
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }

        private async Task<bool> IsEmailUsedAsync(string email)
        {
            return await _userService.GetByEmailAsync(email) != null;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupModel model)
        {
            if (await IsEmailUsedAsync(model.Email))
                return BadRequest(new { Errors = new { Email = "Данная почта уже используется" } });

            await _authenticationService.RegisterAsync(model.Name, model.Surname, model.Email, model.Password, UserRole.Participant);
            return Ok();
        }

        [Authorize]
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
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }

        [Authorize]
        [HttpPost("role")]
        public async Task<IActionResult> PromoteUserAsync()
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var user = await _userService.GetAsync(int.Parse(rowId));
            if (user == null)
                return Unauthorized();

            if (user.RoleId == UserRole.Participant)
            {
                user.RoleId = UserRole.Organizer;
                await _userService.UpdateAsync(user);
                return Ok();
            }

            return BadRequest();
        }

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> UpdateUserAsync([FromBody] UserModel model)
        {
            if (model.Password != null && model.Password != string.Empty && model.Password.Length < 8)
                return BadRequest(new { Errors = new { Password = "Используйте не менее 8 символов", PasswordConfirm = "Используйте не менее 8 символов" } });

            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var user = await _userService.GetAsync(int.Parse(rowId));
            if (user == null)
                return Unauthorized();

            user.Name = model.Name;
            user.Surname = model.Surname;
            user.Email = model.Email;
            await _userService.UpdateAsync(user);

            if (model.Password != null && model.Password != string.Empty)
                await _authenticationService.UpdatePasswordAsync(user.Id, model.Password);

            return Ok();
        }
    }
}
