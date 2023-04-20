using System.Dynamic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EventPlanner.Models;
using EventPlanner.Controllers.Models;
using EventPlanner.Services.AdvertisingServices;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private static readonly string PlaceholderLink = "/Uploads/placeholder.png";

        private Context _context;
        private IAdvertisingService _advertisingService;
        private IEventStorageService _eventStorageService;
        private IEventOrganizationService _eventOrganizationService;
        private IUserService _userService;
        private IWebHostEnvironment _appEnvironment;

        public EventController(
            IWebHostEnvironment appEnvironment,
            Context context,
            IAdvertisingService advertisingService,
            IEventStorageService eventStorageService,
            IEventOrganizationService eventOrganizationService,
            IUserService userService)
        {
            _appEnvironment = appEnvironment;
            _context = context;
            _advertisingService = advertisingService;
            _eventStorageService = eventStorageService;
            _eventOrganizationService = eventOrganizationService;
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

            return events.Select(e =>
            {
                dynamic prepared = PrepareEvent(user, e);
                prepared.MinPrice = e.Tickets.Count > 0 ? e.Tickets.Min(t => t.Price) : 0;
                return prepared;
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var events = await _eventStorageService.GetAvailableAsync();
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Event? reviewEvent = null;
            if (rowId != null)
            {
                var user = await _userService.GetAsync(int.Parse(rowId));
                if (user != null)
                {
                    var userSales = await _eventOrganizationService.GetAllAsync(user.Id);
                    //Достаём все продажи для одного пользователя и сортируем их
                    var sales = userSales
                        .Where(s => s.Ticket.Event.EndDate < DateTime.Now)
                        .OrderByDescending(s => s.Ticket.Event.EndDate);

                    foreach (var sale in sales) {
                        // Берём первую продажу без отзыва
                        if (await _eventOrganizationService.GetReviewBySaleAsync(sale.Id) == null)
                        {
                            reviewEvent = sale.Ticket.Event;
                            break;
                        }
                    }
                }
            }

            return new JsonResult(new
            {
                Events = await PrepareEventsAsync(events),
                Review = reviewEvent != null ? PrepareEvent(null, reviewEvent) : null,
            });
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
                Surname = e.Creator.Surname,
                EventsCount = (await _eventStorageService.GetByCreatorAsync(e.Creator.Id)).Count,
                Rating = await _eventOrganizationService.GetAverageRatingAsync(e.Creator.Id)
            };
            var tickets = await _eventStorageService.GetTicketsByEventAcyns(id);
            var sales = await _eventOrganizationService.GetAllByEventAsync(id);
            e.Tickets = tickets
                .Where(t => t.Until > DateTime.Now && t.Limit > sales.Count)
                .Select(t => new
                {
                    Id = t.Id,
                    Title = t.Title,
                    Limit = t.Limit,
                    Price = t.Price,
                    Until = t.Until
                });
            var questions = await _eventStorageService.GetQuestionsByEventAsync(id);
            e.Questions = questions.Select(q => new
            {
                Id = q.Id,
                Title = q.Title
            });
            e.IsParticipated = user != null ? await _eventOrganizationService.GetAsync(user.Id, eventInfo.Id) != null : false;

            var events = (await _eventStorageService.GetAvailableAsync())
                .Where(ev => ev.CategoryId == e.Category.Id && ev.Id != e.Id)
                .ToList();
            var advertising = await _advertisingService.GetAdvertising(user?.Id, events, 3);
            return new JsonResult(new {
                Event = e,
                Advertising = await PrepareEventsAsync(advertising)
            });
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpGet("{id}/questions")]
        public async Task<IActionResult> GetQuestions(int id)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var e = await _eventStorageService.GetAsync(id);
            if (e == null)
                return NotFound(new { ErrorText = "Мероприятие не найдено" });
            if (e?.CreatorId != int.Parse(rowId))
                return Forbid();

            var questions = await _eventStorageService.GetQuestionsByEventAsync(id);
            return new JsonResult(questions.Select(q => new {
                Id = q.Id,
                Title = q.Title,
                IsEditable = q.IsEditable
            }));
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpGet("{id}/tickets")]
        public async Task<IActionResult> GetTickets(int id)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var e = await _eventStorageService.GetAsync(id);
            if (e == null)
                return NotFound(new { ErrorText = "Мероприятие не найдено" });
            if (e?.CreatorId != int.Parse(rowId))
                return Forbid();

            var tickets = await _eventStorageService.GetTicketsByEventAcyns(id);
            return new JsonResult(tickets.Select(t => new {
                Id = t.Id,
                Title = t.Title,
                Limit = t.Limit,
                Price = t.Price,
                Until = t.Until
            }));
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

            var events = await _eventStorageService.GetAvailableAsync();
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
            var newAddress = new Address();
            if (eventId != null)
            {
                var e = await _eventStorageService.GetAsync((int)eventId);
                if (e?.Address != null)
                    newAddress = e.Address;
            }

            var splitted = address.Split(", ");
            if (splitted.Length != 5)
                return null;

            newAddress.Country = splitted[0];
            newAddress.Region = splitted[1];
            newAddress.City = splitted[2];
            newAddress.Street = splitted[3];
            newAddress.Building = splitted[4];

            if (newAddress.Id != default)
            {
                await _eventStorageService.UpdateAsync(newAddress);
                return newAddress.Id;
            }

            var created = await _eventStorageService.CreateAsync(newAddress);
            return created.Id;
        }

        private async Task<Event> PrepareEvent(int userId, int? eventId, EventModel eventInfo)
        {
            int? addressId = null;
            if (eventInfo.Address != null)
                addressId = await ProcessAddressAsync(eventId, eventInfo.Address);

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

            if (eventId != null)
                newEvent.Id = (int)eventId;

            return newEvent;
        }

        private async Task CreateDefaultQuestion(int eventId, string title)
        {
            var question = new Question()
            {
                EventId = eventId,
                Title = title,
                IsEditable = false
            };

            await _eventStorageService.CreateAsync(question);
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPost("new")]
        public async Task<IActionResult> CreateEvent([FromForm] EventModel newEventInfo)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            if (DateTime.Now > newEventInfo.StartDate)
                return BadRequest(new { Errors = new { StartDate = "Некорректная дата" } });
            if (newEventInfo.StartDate > newEventInfo.EndDate)
                return BadRequest(new { Errors = new { EndDate = "Некорректная дата" } });


            var newEvent = await PrepareEvent(int.Parse(rowId), null, newEventInfo);
            if (newEvent.TypeId == EventType.Offline && newEvent.AddressId == null)
                return BadRequest(new { Errors = new { Address = "Некорректный адрес" } });

            var created = await _eventStorageService.CreateAsync(newEvent);
            await CreateDefaultQuestion(created.Id, "Email");
            await CreateDefaultQuestion(created.Id, "Ваше Имя");
            await CreateDefaultQuestion(created.Id, "Ваша Фамилия");

            return new JsonResult(new { id = created.Id });
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromForm] EventModel eventInfo)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var e = await _eventStorageService.GetAsync(id);
            if (e?.CreatorId != int.Parse(rowId))
                return Forbid();

            if (DateTime.Now > eventInfo.StartDate)
                return BadRequest(new { Errors = new { StartDate = "Некорректная дата" } });
            if (eventInfo.StartDate > eventInfo.EndDate)
                return BadRequest(new { Errors = new { EndDate = "Некорректная дата" } });

            var newEvent = await PrepareEvent(int.Parse(rowId), id, eventInfo);
            if (newEvent.TypeId == EventType.Offline && newEvent.AddressId == null)
                return BadRequest(new { Errors = new { Address = "Некорректный адрес" } });

            if (newEvent.Cover == PlaceholderLink)
                newEvent.Cover = e.Cover;

            _context.Entry(e).CurrentValues.SetValues(newEvent);
            await _eventStorageService.UpdateAsync(e);

            return Ok();
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var e = await _eventStorageService.GetAsync(id);
            if (e?.CreatorId != int.Parse(rowId))
                return Forbid();

            await _eventStorageService.DeleteAsync(id);
            return Ok();
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPost("{id}/questions")]
        public async Task<IActionResult> ProcessQuestions(int id, [FromBody] List<QuestionModel> questions)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var e = await _eventStorageService.GetAsync(id);
            if (e == null)
                return NotFound(new { ErrorText = "Мероприятие не найдено" });
            if (e.CreatorId != int.Parse(rowId))
                return Forbid();

            if (questions.Count == 0)
                return BadRequest(new { ErrorText = "Добавьте билеты" });

            var currentQuestions = await _eventStorageService.GetQuestionsByEventAsync(e.Id);
            foreach (var question in questions)
            {
                if (question.Id > 0)
                {
                    var index = currentQuestions.FindIndex(e => e.Id == question.Id);
                    currentQuestions.RemoveAt(index);
                }

                if (!question.IsEditable)
                    continue;

                if (question.Id > 0)
                {
                    var originalQuestion = await _eventStorageService.GetQuestionAsync(question.Id);
                    if (originalQuestion != null)
                    {
                        _context.Entry(originalQuestion).CurrentValues.SetValues(question);
                        await _eventStorageService.UpdateAsync(originalQuestion);
                        continue;
                    }
                }
                var newQuestion = new Question
                {
                    EventId = id,
                    Title = question.Title,
                    IsEditable = question.IsEditable
                };
                await _eventStorageService.CreateAsync(newQuestion);
            }

            // Удаляем оставшиеся вопросы
            foreach (var question in currentQuestions)
                await _eventStorageService.DeleteQuestionAsync(question.Id);

            return Ok();
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPost("{id}/tickets")]
        public async Task<IActionResult> ProcessTickets(int id, [FromBody] List<TicketModel> tickets)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var e = await _eventStorageService.GetAsync(id);
            if (e == null)
                return NotFound(new { ErrorText = "Мероприятие не найдено" });
            if (e.CreatorId != int.Parse(rowId))
                return Forbid();

            if (tickets.Count == 0)
                return BadRequest(new { ErrorText = "Добавьте билеты" });

            foreach (var ticket in tickets)
            {
                if (ticket.Until < DateTime.Now || ticket.Until > e.StartDate)
                    return BadRequest(new { ErrorText = "Некорректная дата"});

                if (ticket.Limit < 5 && ticket.Limit > 999)
                    return BadRequest(new { ErrorText = "Некорректный лимит"});
            }

            var currentTickets = await _eventStorageService.GetTicketsByEventAcyns(e.Id);
            foreach (var ticket in tickets)
            {
                if (ticket.Id > 0)
                {
                    var index = currentTickets.FindIndex(e => e.Id == ticket.Id);
                    currentTickets.RemoveAt(index);
                    var originalTicket = await _eventStorageService.GetTicketAsync(ticket.Id);
                    if (originalTicket != null)
                    {
                        _context.Entry(originalTicket).CurrentValues.SetValues(ticket);
                        await _eventStorageService.UpdateAsync(originalTicket);
                        continue;
                    }
                }
                var newTicket = new Ticket
                {
                    EventId = id,
                    Title = ticket.Title,
                    Limit = ticket.Limit,
                    Price = ticket.Price,
                    Until = ticket.Until
                };
                await _eventStorageService.CreateAsync(newTicket);
            }

            // Удаляем оставшиеся вопросы
            foreach (var ticket in currentTickets)
                await _eventStorageService.DeleteTicketAsync(ticket.Id);

            return Ok();
        }

        [Authorize]
        [HttpPost("{id}/participate")]
        public async Task<IActionResult> Participate(int id, [FromBody] ParticipationModel patricipation)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var e = await _eventStorageService.GetAsync(id);
            if (e == null)
                return NotFound(new { ErrorText = "Мероприятие не найдено" });

            if (await _eventOrganizationService.GetAsync(int.Parse(rowId), e.Id) != null)
                return BadRequest(new { ErrorText = "Участник уже принимает участие в данном мероприятии" });

            var newSale = new Sale
            {
                TicketId = patricipation.TicketId,
                UserId = Int16.Parse(rowId),
                SaleDate = DateTime.Now,
                Answers = patricipation.Answers.Select(a => new Answer
                {
                    QuestionId = a.QuestionId,
                    Text = a.Text
                }).ToList()
            };
            await _eventOrganizationService.CreateAsync(newSale);

            return Ok();
        }

        [Authorize]
        [HttpPost("{id}/review")]
        public async Task<IActionResult> MakeReviewAsync(int id, [FromBody] ReviewModel review)
        {
            var rowId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rowId == null)
                return Unauthorized();

            var userSales = await _eventOrganizationService.GetAllAsync(int.Parse(rowId));
            var sale = userSales.FirstOrDefault(s => s.Ticket.EventId == id);
            if (sale == null)
                return Forbid();

            if (await _eventOrganizationService.GetReviewBySaleAsync(sale.Id) != null)
                return BadRequest();

            var newReview = new Review
            {
                SaleId = sale.Id,
                Rating = review.Rating
            };

            await _eventOrganizationService.CreateAsync(newReview);

            return Ok();
        }
    }
}
