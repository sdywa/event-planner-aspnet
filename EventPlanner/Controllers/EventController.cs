using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EventPlanner.Models;
using EventPlanner.Controllers.Models;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private Context _context;
        private IEventStorageService _eventStorageService;
        private IUserService _userService;

        public EventController(
            Context context,
            IEventStorageService eventStorageService, IUserService userService) 
        {
            _context = context;
            _eventStorageService = eventStorageService;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllAsync() 
        {
            var events = await _eventStorageService.GetAllAsync();
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null) {
                var user = await _userService.GetAsync(int.Parse(userId));
                return new JsonResult(events.Select(e => new {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    FullDescription = e.FullDescription,
                    Cover = e.Cover,
                    CreationTime = e.CreationTime,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Category = e.Category,
                    Type = e.Type,
                    Creator = e.Creator,
                    Address = e.Address,
                    IsFavorite = user?.FavEvents.FirstOrDefault(f => f.EventId == e.Id) != null
                }));
            }
            return new JsonResult(events);
        }

        [Authorize]
        [HttpPost("{id}/fav")]
        public async Task<IActionResult> ChangeFav(int id, [FromBody] FavEventInfo favEventInfo) 
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();
            
            var eventItem = await _eventStorageService.GetAsync(id);
            if (eventItem == null)
                return BadRequest(new { ErrorText = "Мероприятие не найдено" });
            
            var userId = int.Parse(rowId);
            var favEvent = _context.FavEvents.FirstOrDefault(f => f.EventId == eventItem.Id && f.UserId == userId);

            // Если стало избранным, а favEvent не найден
            if (favEventInfo.IsFavorite && favEvent == null) 
            {
                var newFavEvent = new FavEvent 
                {
                    UserId = userId,
                    EventId = eventItem.Id
                };
                await _context.AddAsync(newFavEvent);
            }             
            else if (!favEventInfo.IsFavorite && favEvent != null)
            {
                _context.Remove(favEvent);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}