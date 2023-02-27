using Microsoft.AspNetCore.Mvc;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private IEventStorageService _eventStorageService;

        public EventController(IEventStorageService eventStorageService) 
        {
            _eventStorageService = eventStorageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync() 
        {
            var events = await _eventStorageService.GetAllAsync();
            return new JsonResult(events);
        }
    }
}