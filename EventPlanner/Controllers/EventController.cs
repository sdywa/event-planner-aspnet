using System.Dynamic;
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
        private static readonly string PlaceholderLink = "/Uploads/placeholder.png";

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

        private Object PrepareEvent(User? user, Event e) 
        {          
            dynamic result = new ExpandoObject();
            result.Id = e.Id;
            result.Title = e.Title;
            result.Description = e.Description;
            result.FullDescription = e.FullDescription;
            result.Cover = LoadImage(e.Cover ?? "");
            result.CreationTime = e.CreationTime;
            result.StartDate = e.StartDate;
            result.EndDate = e.EndDate;
            result.Category = e.Category;
            result.Type = e.Type;
            result.Creator = e.Creator;
            result.Address = e.Address;
            result.IsFavorite = user?.FavEvents.FirstOrDefault(f => f.EventId == e.Id) != null;
            return result;
        }

        private async Task<Object> PrepareEventsAsync(List<Event> events) 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
           
            User? user = null;
            if (userId != null)
                user = await _userService.GetAsync(int.Parse(userId));
            
            return events.Select(e => PrepareEvent(user, e));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync() 
        {
            var events = await _eventStorageService.GetAllAsync();
            return new JsonResult(await PrepareEventsAsync(events));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(int id) 
        {
            var eventInfo = await _eventStorageService.GetAsync(id);
            if (eventInfo == null)
                return BadRequest();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            User? user = null;
            if (userId != null)
                user = await _userService.GetAsync(int.Parse(userId));
            
            dynamic e = PrepareEvent(user, eventInfo);
            e.Creator = new {
                Id = e.Creator.Id,
                Name = e.Creator.Name,
                EventsCount = e.Creator.CreatedEvents.Count,
                Rating = 5
            };
            e.Tickets = new List<Object>
            {
                new { Id = 1, Name = "Входной билет", Price = 0 },
                new { Id = 2, Name = "Очень длинное название билетаfffffffffааааааа", Price = 100 },
            };
            e.Questions = new List<Object>
            {
                new { Id = 1, Name = "Email" },
                new { Id = 2, Name = "Имя" },
                new { Id = 3, Name = "Фамилия" },
                new { Id = 4, Name = "Ваш возраст" },
            };
            return new JsonResult(e);
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
            
            return new JsonResult(await PrepareEventsAsync(events));
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
            return PlaceholderLink;
        }

        private async Task<int?> ProcessAddressAsync(int? eventId, string address) 
        {
            int? addressId = null;
            if (eventId != null)
            {
                var e = await _eventStorageService.GetAsync((int)eventId);
                addressId = e?.AddressId;
            }
            
            var splitted = address.Split(", ");
            if (splitted.Length != 5)
                return null;
            
            var newAddress = new Address()
            {
                Country = splitted[0],
                Region = splitted[1],
                City = splitted[2],
                Street = splitted[3],
                Building = splitted[4]
            };

            if (addressId != null)
            {
                newAddress.Id = (int)addressId;
                await _eventStorageService.UpdateAddressAsync(newAddress);
            }
            else
            {
                var created = await _eventStorageService.AddAddressAsync(newAddress);
                addressId = created.Id;
            }

            return addressId;
        }

        private async Task<Event> PrepareEvent(int userId, EventModel eventInfo)
        {
            int? addressId = null;
            if (eventInfo.Address != null) 
                addressId = await ProcessAddressAsync(eventInfo.Id, eventInfo.Address);

            var cover = await UploadImage(eventInfo.Cover);
            var newEvent = new Event() {
                Title = eventInfo.Title,
                Description = eventInfo.Description,
                FullDescription = eventInfo.FullDescription,
                Cover = cover,
                CreationTime = DateTime.Now,
                StartDate = eventInfo.StartDate,
                EndDate = eventInfo.EndDate,
                CategoryId = eventInfo.Category,
                TypeId = eventInfo.Type,
                CreatorId = userId,
                AddressId = addressId
            };

            if (eventInfo.Id != null)
                newEvent.Id = (int)eventInfo.Id;

            return newEvent;
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

            if (DateTime.Now > newEventInfo.StartDate)
                return BadRequest(new { Errors = new { StartDate = "Некорректная дата" } });
            if (newEventInfo.StartDate > newEventInfo.EndDate)
                return BadRequest(new { Errors = new { EndDate = "Некорректная дата" } });

            
            var newEvent = await PrepareEvent(int.Parse(rowId), newEventInfo);
            if (newEvent.TypeId == EventType.Offline && newEvent.AddressId == null)
                return BadRequest(new { Errors = new { Address = "Некорректный адрес" } });
            
            var created = await _eventStorageService.CreateAsync(newEvent);

            return new JsonResult(new { id = created.Id });
        }
    
        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateEvent([FromForm] EventModel eventInfo)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            if (eventInfo.Id == null)
                return BadRequest();

            var e = await _eventStorageService.GetAsync((int)eventInfo.Id);
            if (e?.CreatorId != int.Parse(rowId))
                return Forbid(); 

            if (DateTime.Now > eventInfo.StartDate)
                return BadRequest(new { Errors = new { StartDate = "Некорректная дата" } });
            if (eventInfo.StartDate > eventInfo.EndDate)
                return BadRequest(new { Errors = new { EndDate = "Некорректная дата" } });

            var newEvent = await PrepareEvent(int.Parse(rowId), eventInfo);
            if (newEvent.TypeId == EventType.Offline && newEvent.AddressId == null)
                return BadRequest(new { Errors = new { Address = "Некорректный адрес" } });

            if (newEvent.Cover == PlaceholderLink)
                newEvent.Cover = e.Cover;
            
            _context.Entry(e).CurrentValues.SetValues(newEvent);
            await _eventStorageService.UpdateAsync(e);

            return Ok();
        }
    }
}