using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using EventPlanner.Models;
using EventPlanner.Exceptions;
using EventPlanner.Services.ChatServices;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Controller : ControllerBase
    {
        protected string UploadFolder { get => $"{_appEnvironment.WebRootPath}/Uploads/"; }
        protected IWebHostEnvironment _appEnvironment;

        protected IEventStorageService _eventStorageService;
        protected IEventOrganizationService _eventOrganizationService;
        protected IChatService _chatService;
        protected IUserService _userService;

        public Controller(
            IWebHostEnvironment appEnvironment,
            IEventStorageService eventStorageService,
            IEventOrganizationService eventOrganizationService,
            IChatService chatService,
            IUserService userService)
        {
            _appEnvironment = appEnvironment;
            _eventStorageService = eventStorageService;
            _eventOrganizationService = eventOrganizationService;
            _chatService = chatService;
            _userService = userService;
        }

        protected async Task<User?> TryGetUserAsync()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (id == null)
                return null;

            var user = await _userService.GetAsync(int.Parse(id));
            if (user == null)
                return null;

            return user;
        }

        protected async Task<User> GetUserAsync()
        {
            var user = await TryGetUserAsync();
            if (user == null)
                throw new UserNotFoundException();
            return user;
        }

        protected string? LoadImage(string filename)
        {
            var fullPath = $"{UploadFolder}{filename}";
            if (System.IO.File.Exists(fullPath))
            {
                var bytes = System.IO.File.ReadAllBytes(fullPath);
                return Convert.ToBase64String(bytes);
            }
            return null;
        }

        protected void CreateUploadFolderIfNotExist()
        {
            if (!Directory.Exists(UploadFolder))
                Directory.CreateDirectory(UploadFolder);
        }

        protected Dictionary<string, object?> PrepareEvent(Event e, User? user, HashSet<string> fields)
        {
            var type = typeof(Event);
            var prepared = new Dictionary<string, object?>();

            foreach (var pi in type.GetProperties())
            {
                if (!fields.Contains(pi.Name))
                    continue;
                prepared[pi.Name] = type.GetProperty(pi.Name)?.GetValue(e);
            }

            if (fields.Contains("Cover"))
                prepared["Cover"] = LoadImage(e.Cover ?? "");

            if (fields.Contains("IsFavorite"))
                prepared["IsFavorite"] = user?.FavEvents.FirstOrDefault(f => f.EventId == e.Id) != null;

            return prepared;
        }

        protected async Task<Dictionary<string, object?>> PrepareEventAsync(Event e)
        {
            var user = await TryGetUserAsync();
            return PrepareEvent(e, user, new HashSet<string> {
                nameof(e.Id),
                nameof(e.Title),
                nameof(e.Cover),
                nameof(e.Description),
                nameof(e.Category),
                nameof(e.Type),
                nameof(e.StartDate),
                nameof(e.EndDate),
                nameof(e.Address),
                "IsFavorite"
            });
        }

        protected async Task<Dictionary<string, object?>> PrepareExtendedEventAsync(Event e)
        {
            var prepared = await PrepareEventAsync(e);

            prepared["FullDescription"] = e.FullDescription;
            prepared["Creator"] = new
            {
                Id = e.Creator.Id,
                Name = e.Creator.Name,
                Surname = e.Creator.Surname,
                EventsCount = (await _eventStorageService.GetByCreatorAsync(e.Creator.Id)).Count,
                Rating = await _eventOrganizationService.GetAverageRatingAsync(e.Creator.Id)
            };

            var sales = await _eventOrganizationService.GetAllByEventAsync(e.Id);
            prepared["Tickets"] = e.Tickets
                .Where(t => t.Until > DateTime.Now && t.Limit > sales.Count)
                .Select(t => new
                {
                    Id = t.Id,
                    Title = t.Title,
                    Limit = t.Limit,
                    Price = t.Price,
                    Until = t.Until
                });

            prepared["Questions"] = e.Questions.Select(q => new
            {
                Id = q.Id,
                Title = q.Title
            });

            var user = await TryGetUserAsync();
            prepared["IsParticipated"] = user != null ? await _eventOrganizationService.GetAsync(user.Id, e.Id) != null : false;

            return prepared;
        }
    }
}
