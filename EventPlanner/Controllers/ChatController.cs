using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EventPlanner.Controllers.Models;
using EventPlanner.Exceptions;
using EventPlanner.Models;
using EventPlanner.Services.ChatServices;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : Controller
    {
        public ChatController(
            IWebHostEnvironment appEnvironment,
            IEventStorageService eventStorageService,
            IEventOrganizationService eventOrganizationService,
            IChatService chatService,
            IUserService userService) : base(appEnvironment, eventStorageService, eventOrganizationService, chatService, userService)
        { }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChatAsync(int id)
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
                        creatorId = chat.InitiatorId,
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

        [Authorize]
        [HttpPost("{id}")]
        public async Task<IActionResult> CreateMessageAsync(int id, [FromBody] MessageModel model)
        {
            try
            {
                var user = await GetUserAsync();
                var chat = await _chatService.GetChatAsync(id);
                if (chat == null)
                    throw new ChatNotFoundException();

                if (chat.InitiatorId != user.Id && chat.Event.CreatorId != user.Id)
                    return Forbid();

                var message = new Message {
                    ChatId = chat.Id,
                    CreatorId = user.Id,
                    Text = model.Text
                };
                await _chatService.CreateAsync(message);
                var status = ChatStatus.Active;
                if (model.CloseChat)
                    status = ChatStatus.Closed;
                else if (chat.InitiatorId == user.Id)
                    status = ChatStatus.Waiting;

                await _chatService.UpdateChatStatusAsync(chat.Id, status);
                return await GetChatAsync(id);
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }
    }
}
