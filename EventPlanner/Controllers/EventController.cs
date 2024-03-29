using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Controllers.Models;
using EventPlanner.Exceptions;
using EventPlanner.Models;
using EventPlanner.Services.AdvertisingServices;
using EventPlanner.Services.ChatServices;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : Controller
    {
        private static readonly string PlaceholderLink = "placeholder.png";

        private Context _context;
        private IAdvertisingService _advertisingService;

        public EventController(
            IWebHostEnvironment appEnvironment,
            Context context,
            IAdvertisingService advertisingService,
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
            _context = context;
            _advertisingService = advertisingService;
        }

        private async Task<string> UploadImageAsync(IFormFile? image)
        {
            CreateUploadFolderIfNotExist();
            if (image != null)
            {
                string ex = System.IO.Path.GetExtension(image.FileName);
                string filename = $"{Math.Abs(image.FileName.GetHashCode())}{ex}";

                using (
                    var fileStream = new FileStream($"{UploadFolder}{filename}", FileMode.Create)
                )
                    await image.CopyToAsync(fileStream);
                return filename;
            }
            return PlaceholderLink;
        }

        private async Task<Object> PrepareEventsAsync(List<Event> events)
        {
            var result = new List<Dictionary<string, object?>>();
            foreach (var e in events)
            {
                var prepared = await PrepareEventAsync(e);
                prepared["MinPrice"] = e.Tickets.Count > 0 ? e.Tickets.Min(t => t.Price) : 0;
                result.Add(prepared);
            }
            return result;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            object? eventForReview = null;
            var events = await _eventStorageService.GetAvailableAsync();
            var user = await TryGetUserAsync();
            if (user != null)
            {
                // В случае входа в аккаунт нужно показать отзыв
                var userSales = await _eventOrganizationService.GetAllAsync(user.Id);
                var sales = userSales
                    .Where(s => s.Ticket.Event.StartDate < DateTime.Now)
                    .OrderByDescending(s => s.Ticket.Event.EndDate);

                foreach (var sale in sales)
                    if (await _eventOrganizationService.GetReviewBySaleAsync(sale.Id) == null)
                    {
                        eventForReview = await PrepareEventAsync(sale.Ticket.Event);
                        break;
                    }
            }

            return new JsonResult(
                new { Events = await PrepareEventsAsync(events), Review = eventForReview, }
            );
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            try
            {
                User? user = await TryGetUserAsync();
                var eventInfo = await _eventStorageService.GetByIdAsync(id);
                var e = await PrepareExtendedEventAsync(eventInfo);
                var events = (await _eventStorageService.GetAvailableAsync())
                    .Where(ev => ev.CategoryId == eventInfo.Category.Id && ev.Id != eventInfo.Id)
                    .ToList();
                var advertising = await _advertisingService.GetAdvertisingFromAsync(
                    events,
                    3,
                    user?.Id
                );
                return new JsonResult(
                    new { Event = e, Advertising = await PrepareEventsAsync(advertising) }
                );
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpGet("{id}/questions")]
        public async Task<IActionResult> GetQuestionsAsync(int id)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                var questions = await _eventStorageService.GetQuestionsByEventAsync(id);
                return new JsonResult(
                    new
                    {
                        title = e.Title,
                        questions = questions.Select(
                            q =>
                                new
                                {
                                    Id = q.Id,
                                    Title = q.Title,
                                    IsEditable = q.IsEditable
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

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpGet("{id}/tickets")]
        public async Task<IActionResult> GetTicketsAsync(int id)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                var tickets = await _eventStorageService.GetTicketsByEventAcyns(id);
                return new JsonResult(
                    new
                    {
                        title = e.Title,
                        tickets = tickets.Select(
                            t =>
                                new
                                {
                                    Id = t.Id,
                                    Title = t.Title,
                                    Limit = t.Limit,
                                    Price = t.Price,
                                    Until = t.Until
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

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpGet("{id}/statistics")]
        public async Task<IActionResult> GetStatisticsAsync(int id)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                var tickets = await _eventStorageService.GetTicketsByEventAcyns(id);
                var ticketsData = new List<Dictionary<string, object>>();

                var totalCount = 0;
                var totalIncome = 0;
                foreach (var ticket in tickets)
                {
                    var sales = await _eventOrganizationService.GetAllByTicketAsync(ticket.Id);

                    var salesByDate = sales
                        .GroupBy(s => s.SaleDate.ToString("yyyy-MM-dd"))
                        .ToDictionary(g => g.Key, g => g.Count());

                    totalCount += sales.Count;
                    totalIncome += sales.Count * ticket.Price;
                    ticketsData.Add(
                        new Dictionary<string, object>
                        {
                            ["id"] = ticket.Id,
                            ["title"] = ticket.Title,
                            ["status"] = sales.Count >= ticket.Limit ? "Closed" : "Active",
                            ["price"] = ticket.Price,
                            ["income"] = sales.Count * ticket.Price,
                            ["salesCount"] = sales.Count,
                            ["sales"] = salesByDate
                        }
                    );
                }

                return new JsonResult(
                    new
                    {
                        title = e.Title,
                        count = totalCount,
                        income = totalIncome,
                        tickets = ticketsData
                    }
                );
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpGet("{id}/participants")]
        public async Task<IActionResult> GetParticipantsAsync(int id)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                var sales = await _eventOrganizationService.GetAllByEventAsync(id);
                var participants = new List<object>();
                foreach (var sale in sales)
                {
                    participants.Add(
                        new
                        {
                            id = sale.UserId,
                            name = sale.User.Name,
                            surname = sale.User.Surname,
                            email = sale.User.Email,
                            answers = _context.Answers
                                .Include(a => a.Question)
                                .Where(a => a.SaleId == sale.Id)
                                .Select(a => new { question = a.Question.Title, text = a.Text })
                        }
                    );
                }

                return new JsonResult(new { title = e.Title, participants = participants });
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpGet("{id}/chats")]
        public async Task<IActionResult> GetChatsAsync(int id)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                var chats = await _chatService.GetChatsByEventAsync(id);
                return new JsonResult(
                    new
                    {
                        title = e.Title,
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

        [Authorize]
        [HttpPost("{id}/chats")]
        public async Task<IActionResult> CreateChatAsync(int id, [FromBody] ChatModel model)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId == user.Id)
                    return Forbid();

                var chat = await _chatService.CreateChatAsync(
                    new Chat
                    {
                        EventId = e.Id,
                        InitiatorId = user.Id,
                        StatusId = ChatStatus.Waiting,
                        Theme = model.Theme
                    }
                );

                await _chatService.CreateAsync(
                    new Message
                    {
                        ChatId = chat.Id,
                        CreatorId = user.Id,
                        Text = model.Text
                    }
                );
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }

            return Ok();
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpDelete("{id}/participants/{userId}")]
        public async Task<IActionResult> DeleteParticipantAsync(int id, int userId)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                await _eventOrganizationService.DeleteAsync(userId, id);
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }

            return Ok();
        }

        [Authorize]
        [HttpPost("{id}/fav")]
        public async Task<IActionResult> ChangeFavAsync(
            int id,
            [FromBody] FavEventModel favEventInfo
        )
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);

                var favEvent = _context.FavEvents.FirstOrDefault(
                    f => f.EventId == e.Id && f.UserId == user.Id
                );
                // Пользователь добавляет мероприятие в избранное
                if (favEventInfo.IsFavorite && favEvent == null)
                {
                    var newFavEvent = new FavEvent { UserId = user.Id, EventId = e.Id };
                    await _context.AddAsync(newFavEvent);
                }
                else if (!favEventInfo.IsFavorite && favEvent != null)
                {
                    _context.Remove(favEvent);
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
            return Ok();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync(string search)
        {
            search = search.ToLower().Trim();
            if (search == string.Empty)
                throw new ActionException<BadRequestObjectResult>("Пустая строка поиска");

            var events = await _eventStorageService.GetAvailableAsync();
            events = events
                .Where(
                    e =>
                        e.Title.ToLower().Contains(search)
                        || e.Description.ToLower().Contains(search)
                )
                .ToList();

            return new JsonResult(await PrepareEventsAsync(events));
        }

        private async Task<int?> ProcessAddressAsync(AddressModel address, int? eventId)
        {
            var newAddress = new Address();

            newAddress.Latitude = address.Latitude;
            newAddress.Longitude = address.Longitude;
            newAddress.Full = address.Full;
            newAddress.Region = address.Region;
            newAddress.City = address.City;
            newAddress.Street = address.Street;
            newAddress.House = address.House;
            newAddress.Block = address.Block;

            if (eventId != null)
            {
                var e = await _eventStorageService.GetAsync((int)eventId);
                if (e?.Address != null)
                {
                    newAddress = e.Address;
                    await _eventStorageService.UpdateAsync(newAddress);
                    return newAddress.Id;
                }
            }

            var created = await _eventStorageService.CreateAsync(newAddress);
            return created.Id;
        }

        private async Task<Event> MakeNewEventAsync(int userId, EventModel eventInfo)
        {
            if (DateTime.Now > eventInfo.StartDate)
                throw new ActionException<BadRequestObjectResult>("Некорректная дата")
                {
                    PropertyName = "StartDate"
                };
            if (eventInfo.StartDate > eventInfo.EndDate)
                throw new ActionException<BadRequestObjectResult>("Некорректная дата")
                {
                    PropertyName = "EndDate"
                };

            int? addressId = null;
            Console.WriteLine($"address is: {eventInfo.Address} {eventInfo.Address?.Full}");
            if (eventInfo.Address != null)
                addressId = await ProcessAddressAsync(eventInfo.Address, null);

            var cover = await UploadImageAsync(eventInfo.Cover);
            var newEvent = new Event()
            {
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

            if (newEvent.TypeId == EventType.Offline && newEvent.AddressId == null)
                throw new ActionException<BadRequestObjectResult>("Некорректный адрес")
                {
                    PropertyName = "Address"
                };

            return newEvent;
        }

        private async Task CreateDefaultQuestionAsync(int eventId, string title)
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
        public async Task<IActionResult> CreateEventAsync([FromForm] EventModel newEventInfo)
        {
            try
            {
                var user = await GetUserAsync();
                var created = await _eventStorageService.CreateAsync(
                    await MakeNewEventAsync(user.Id, newEventInfo)
                );
                await CreateDefaultQuestionAsync(created.Id, "Email");
                await CreateDefaultQuestionAsync(created.Id, "Ваше Имя");
                await CreateDefaultQuestionAsync(created.Id, "Ваша Фамилия");

                return new JsonResult(new { id = created.Id });
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateEventAsync(int id, [FromForm] EventModel eventInfo)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                var newEvent = await MakeNewEventAsync(user.Id, eventInfo);
                newEvent.Id = id;

                if (newEvent.Cover == PlaceholderLink)
                    newEvent.Cover = e.Cover;

                _context.Entry(e).CurrentValues.SetValues(newEvent);
                await _eventStorageService.UpdateAsync(e);
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
            return Ok();
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventAsync(int id)
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                await _eventStorageService.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
            return Ok();
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPost("{id}/questions")]
        public async Task<IActionResult> ProcessQuestionsAsync(
            int id,
            [FromBody] QuestionModel model
        )
        {
            var questions = model.Questions;

            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                if (questions.Count == 0)
                    throw new ActionException<BadRequestObjectResult>("Добавьте вопросы");

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
                        var originalQuestion = await _eventStorageService.GetQuestionAsync(
                            question.Id
                        );
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
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
            return Ok();
        }

        [Authorize(Roles = "Organizer,Administrator")]
        [HttpPost("{id}/tickets")]
        public async Task<IActionResult> ProcessTicketsAsync(int id, [FromBody] TicketModel model)
        {
            var tickets = model.Tickets;

            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);
                if (e.CreatorId != user.Id)
                    return Forbid();

                if (tickets.Count == 0)
                    throw new ActionException<BadRequestObjectResult>("Добавьте билеты");

                foreach (var ticket in tickets)
                {
                    if (ticket.Until < DateTime.Now || ticket.Until > e.StartDate)
                        throw new ActionException<BadRequestObjectResult>("Некорректная дата");

                    if (ticket.Limit < 5 || ticket.Limit > 999)
                        throw new ActionException<BadRequestObjectResult>("Некорректный лимит");
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
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
            return Ok();
        }

        [Authorize]
        [HttpPost("{id}/participate")]
        public async Task<IActionResult> ParticipateAsync(
            int id,
            [FromBody] ParticipationModel patricipation
        )
        {
            try
            {
                var user = await GetUserAsync();
                var e = await _eventStorageService.GetByIdAsync(id);

                if (await _eventOrganizationService.GetAsync(user.Id, e.Id) != null)
                    throw new ActionException<BadRequestObjectResult>(
                        "Участник уже принимает участие в данном мероприятии"
                    );

                var newSale = new Sale
                {
                    TicketId = patricipation.TicketId,
                    UserId = user.Id,
                    SaleDate = DateTime.Now,
                    Answers = patricipation.Answers
                        .Select(a => new Answer { QuestionId = a.QuestionId, Text = a.Text })
                        .ToList()
                };
                await _eventOrganizationService.CreateAsync(newSale);
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
            return Ok();
        }

        [Authorize]
        [HttpPost("{id}/review")]
        public async Task<IActionResult> MakeReviewAsync(int id, [FromBody] ReviewModel review)
        {
            try
            {
                var user = await GetUserAsync();
                var userSales = await _eventOrganizationService.GetAllAsync(user.Id);
                var sale = userSales.FirstOrDefault(s => s.Ticket.EventId == id);
                if (sale == null)
                    return Forbid();

                if (await _eventOrganizationService.GetReviewBySaleAsync(sale.Id) != null)
                    throw new ActionException<BadRequestObjectResult>(
                        "Мероприятие уже имеет отзыв"
                    );

                var newReview = new Review { SaleId = sale.Id, Rating = review.Rating };

                await _eventOrganizationService.CreateAsync(newReview);
            }
            catch (Exception ex)
            {
                return ExceptionHandler.Handle(ex);
            }
            return Ok();
        }
    }
}
