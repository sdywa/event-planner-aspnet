using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Controllers.Models;
using EventPlanner.Exceptions;
using EventPlanner.Models;
using EventPlanner.Services.AuthenticationServices;
using EventPlanner.Services.ChatServices;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private IAuthenticationService _authenticationService;
        private EventPlanner.Services.AuthorizationService.IAuthorizationService _authorizationService;
        private Context _context;

        public UserController(
            Context context,
            IWebHostEnvironment appEnvironment,
            IAuthenticationService authenticationService,
            EventPlanner.Services.AuthorizationService.IAuthorizationService authorizationService,
            IEventStorageService eventStorageService,
            IEventOrganizationService eventOrganizationService,
            IChatService chatService,
            IUserService userService
        )
            : base(
                appEnvironment,
                eventStorageService,
                eventOrganizationService,
                chatService,
                userService
            )
        {
            _authenticationService = authenticationService;
            _authorizationService = authorizationService;
            _context = context;
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshTokenAsync([FromBody] TokenModel? model)
        {
            try
            {
                if (model?.Token == null)
                    throw new ActionException<BadRequestObjectResult>("Непредвиденная ошибка");

                var user = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.RefreshToken)
                    .FirstOrDefaultAsync(u => u.RefreshTokenId == model.Token);

                if (user == null)
                    throw new ActionException<BadRequestObjectResult>("Непредвиденная ошибка");

                return new JsonResult(
                    await _authorizationService.RefreshTokensAsync(user, model.Token)
                );
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {
            try
            {
                var user = await _authenticationService.LoginAsync(model.Email, model.Password);
                var accessToken = _authorizationService.GetAccessToken(user);
                var refreshToken = await _authorizationService.GetRefreshTokenAsync(user);

                return new JsonResult(
                    new
                    {
                        accessToken = accessToken,
                        refreshToken = refreshToken,
                        user = new
                        {
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

        private async Task<bool> IsEmailUsedAsync(string email) =>
            await _userService.GetByEmailAsync(email) != null;

        [HttpPost("signup")]
        public async Task<IActionResult> SignupAsync([FromBody] SignupModel model)
        {
            if (await IsEmailUsedAsync(model.Email))
                return new ActionException<BadRequestObjectResult>("Данная почта уже используется")
                {
                    PropertyName = "Email"
                }.FormResponse();

            await _authenticationService.RegisterAsync(
                model.Name,
                model.Surname,
                model.Email,
                model.Password,
                UserRole.Participant
            );
            return Ok();
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> LogoutAsync([FromBody] TokenModel? model)
        {
            try
            {
                if (model?.Token == null)
                    throw new ActionException<BadRequestObjectResult>("Непредвиденная ошибка");

                var user = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.RefreshToken)
                    .FirstOrDefaultAsync(u => u.RefreshTokenId == model.Token);

                if (user == null)
                    throw new ActionException<BadRequestObjectResult>("Непредвиденная ошибка");

                await _authorizationService.RemoveRefreshTokenAsync(user, model.Token);
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

            return new ActionException<BadRequestObjectResult>(
                "Непредвиденная ошибка"
            ).FormResponse();
        }

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> UpdateUserAsync([FromBody] UserModel model)
        {
            if (
                model.Password != null
                && model.Password != string.Empty
                && model.Password.Length < 8
            )
                return BadRequest(
                    new
                    {
                        Errors = new
                        {
                            Password = "Используйте не менее 8 символов",
                            PasswordConfirm = "Используйте не менее 8 символов"
                        }
                    }
                );

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

        [Authorize]
        [HttpGet("history")]
        public async Task<IActionResult> GetHistoryAsync()
        {
            try
            {
                var user = await GetUserAsync();
                List<object>? created = null;
                if (user.RoleId != UserRole.Participant)
                {
                    created = new List<object>();
                    foreach (var e in await _eventStorageService.GetByCreatorAsync(user.Id))
                        created.Add(await PrepareEventAsync(e));
                }

                List<object> participated = new List<object>();
                var tickets = await _eventOrganizationService.GetAllByUserAsync(user.Id);
                foreach (var ticket in tickets.OrderByDescending(t => t.SaleDate))
                    participated.Add(
                        await PrepareEventAsync(
                            await _eventStorageService.GetByIdAsync(ticket.Ticket.EventId)
                        )
                    );

                return new JsonResult(new { Created = created, Participated = participated });
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }

        [Authorize]
        [HttpGet("chats")]
        public async Task<IActionResult> GetChatsAsync()
        {
            try
            {
                var user = await GetUserAsync();
                var chats = await _chatService.GetChatsByCreatorAsync(user.Id);
                return new JsonResult(
                    new
                    {
                        chats = chats
                            .OrderBy(c => c.StatusId != ChatStatus.Waiting)
                            .ThenBy(c => c.StatusId != ChatStatus.Waiting)
                            .Select(
                                c =>
                                    new
                                    {
                                        id = c.Id,
                                        theme = c.Theme,
                                        status = c.Status.Name
                                    }
                            )
                    }
                );
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }
    }
}
