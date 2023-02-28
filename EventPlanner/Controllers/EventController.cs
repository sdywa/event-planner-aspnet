using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EventPlanner.Models;
using EventPlanner.Controllers.Models;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private Context _context;
        private IEventStorageService _eventStorageService;
        private IUserService _userService;
        private IWebHostEnvironment _appEnvironment;

        public EventController(
            Context context,
            IEventStorageService eventStorageService, IUserService userService,
            IWebHostEnvironment appEnvironment) 
        {
            _appEnvironment = appEnvironment;
            _context = context;
            _eventStorageService = eventStorageService;
            _userService = userService;
        }

        private string? LoadImage(string path) 
        {
            var fullPath = $"{_appEnvironment.WebRootPath}{path}";
            if (System.IO.File.Exists(fullPath)) 
            {
                var bytes = System.IO.File.ReadAllBytes(fullPath);
                return Convert.ToBase64String(bytes);
            }
            return null;
        }

        private async Task<Object> PrepareEvents(List<Event> events) 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
           
            User? user = null;
            if (userId != null)
                user = await _userService.GetAsync(int.Parse(userId));
            
            return events.Select(e => new {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                FullDescription = e.FullDescription,
                Cover = LoadImage(e.Cover ?? ""),
                CreationTime = e.CreationTime,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Category = e.Category,
                Type = e.Type,
                Creator = e.Creator,
                Address = e.Address,
                IsFavorite = user?.FavEvents.FirstOrDefault(f => f.EventId == e.Id) != null
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync() 
        {
            var events = await _eventStorageService.GetAllAsync();
            return new JsonResult(await PrepareEvents(events));
        }

        [Authorize]
        [HttpPost("{id}/fav")]
        public async Task<IActionResult> ChangeFavAsync(int id, [FromBody] FavEventInfo favEventInfo) 
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
    
        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync(string search)
        {
            search = search.ToLower().Trim();
            if (search == string.Empty)
                return BadRequest(new { ErrorText = "Пустая строка поиска" });

            var events = await _eventStorageService.GetAllAsync();
            events = events
                .Where(e => e.Title.ToLower().Contains(search) || 
                    e.Description.ToLower().Contains(search))
                .ToList();
            
            return new JsonResult(await PrepareEvents(events));
        }


        private void CreateUploadIfNotExist() 
        {
            var path = $"{_appEnvironment.WebRootPath}/Uploads";
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
        }

        private async Task<string> UploadImage(IFormFile? image) 
        {
            CreateUploadIfNotExist();
            if (image != null)
            {
                string ex = System.IO.Path.GetExtension(image.FileName);
                string path = $"/Uploads/{Math.Abs(image.FileName.GetHashCode())}{ex}";
                
                using (var fileStream = new FileStream($"{_appEnvironment.WebRootPath}/{path}", FileMode.Create))
                    await image.CopyToAsync(fileStream);
                return path;
            }
            return "/Uploads/placeholder.png";
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPost("new")]
        public async Task<IActionResult> CreateEvent([FromForm] EventModel newEventInfo) 
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            if (newEventInfo.Id != null)
                return BadRequest();

            if (newEventInfo.StartDate > newEventInfo.EndDate)
                return BadRequest(new { Errors = new { EndDate = "Некорректная дата" } });

            int? addressId = null;
            if (newEventInfo.Address != null) 
            {
                var address = newEventInfo.Address.Split(", ");
                if (address.Length != 5)
                    return BadRequest(new { Errors = new { Address = "Некорректный адрес" } });

                var newAddress = new Address()
                {
                    Country = address[0],
                    Region = address[1],
                    City = address[2],
                    Street = address[3],
                    Building = address[4],
                };
                newAddress = await _eventStorageService.AddAddressAsync(newAddress);
                addressId = newAddress.Id;
            }

            var cover = await UploadImage(newEventInfo.Cover);
            var newEvent = new Event() {
                Title = newEventInfo.Title,
                Description = newEventInfo.Description,
                FullDescription = newEventInfo.FullDescription,
                Cover = cover,
                CreationTime = DateTime.Now,
                StartDate = newEventInfo.StartDate,
                EndDate = newEventInfo.EndDate,
                CategoryId = newEventInfo.Category,
                TypeId = newEventInfo.Type,
                CreatorId = int.Parse(rowId),
                AddressId = addressId
            };

            var created = await _eventStorageService.CreateAsync(newEvent);

            return new JsonResult(new { id = created.Id });
        }
    }
}