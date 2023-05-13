using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EventPlanner.Exceptions;
using EventPlanner.Models;
using EventPlanner.Services.ChatServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private IChatService _chatService;
        private IUserService _userService;

        public ChatController(
            IChatService eventChatService,
            IUserService userService)
        {
            _chatService = eventChatService;
            _userService = userService;
        }

        private async Task<User?> TryGetUserAsync()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (id == null)
                return null;

            var user = await _userService.GetAsync(int.Parse(id));
            if (user == null)
                return null;

            return user;
        }

        private async Task<User> GetUserAsync()
        {
            var user = await TryGetUserAsync();
            if (user == null)
                throw new UserNotFoundException();
            return user;
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChat(int id)
        {
            try
            {
                var user = await GetUserAsync();
                var chat = await _chatService.GetChatAsync(id);
                if (chat == null)
                    throw new ChatNotFoundException();

                if (chat.InitiatorId != user.Id && chat.Event.CreatorId != user.Id)
                    return Forbid();

                return new JsonResult(
                    new {
                        id = chat.Id,
                        theme = chat.Theme,
                        status = chat.Status.Name,
                        creator = $"{chat.Initiator.Name} {chat.Initiator.Surname}",
                        creationTime = chat.CreationTime,
                        messages = chat.Messages.Select(m => new {
                            creator = m.Creator.Name,
                            creationTime = m.CreationTime,
                            text = m.Text
                        })
                    });
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }
    }
}
