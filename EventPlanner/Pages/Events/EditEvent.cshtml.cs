using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Helpers;
using EventPlanner.Models;
using EventPlanner.Models.Events;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;

namespace EventPlanner.Pages;

[Authorize(Roles = "Organizer")]
public class EditEventModel : PageModel
{
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }
    [BindProperty(SupportsGet = true)]
    public bool IsValid { get; set; } = true;
    [BindProperty]
    public NewEvent NewEvent { get; set; } = null!;
    [BindProperty]
    public NewAddress Address { get; set; } = null!;
    [BindProperty]
    [PageRemote(
        PageHandler = "CheckStartDate", 
        HttpMethod = "post", 
        ErrorMessage = "Неправильная дата",
        AdditionalFields = "__RequestVerificationToken")]
    public string? StartDate { get; set; } = null!;
    [BindProperty]
    [PageRemote(
        PageHandler = "CheckEndDate", 
        HttpMethod = "post", 
        ErrorMessage = "Неправильная дата",
        AdditionalFields = "StartDate,__RequestVerificationToken")]
    public string? EndDate { get; set; } = null!;
    public List<Category> Categories { get; set; } = null!;
    public List<EventType> Types { get; set; } = null!;
    public Event CurrentEvent { get; set; } = null!;
    private IWebHostEnvironment _appEnvironment;
    private PlannerContext _context;
    private IEventStorageService _eventStorageService { get; set; }
    private IEventOrganizationService _eventOrganizationService { get; set; }

    public EditEventModel(IWebHostEnvironment appEnvironment, PlannerContext context, IEventStorageService eventStorageService, IEventOrganizationService eventOrganizationService)
    {
        _appEnvironment = appEnvironment;
        _context = context;
        _eventStorageService = eventStorageService;
        _eventOrganizationService = eventOrganizationService;
    }

    public async Task<IActionResult> OnGetAsync(CancellationToken cancellationToken)
    {
        Categories = _context.Categories.ToList();
        Types = _context.EventTypes.ToList();
        var foundEvent = await _eventStorageService.GetAsync(Id, cancellationToken);
        if (foundEvent is null)
            return BadRequest();

        CurrentEvent = foundEvent;
        NewEvent = new NewEvent {
            Name = CurrentEvent.Name,
            Description = CurrentEvent.Description,
            TypeId = CurrentEvent.TypeId,
            CategoryId = CurrentEvent.CategoryId
        };
        if (CurrentEvent.Address is not null)
        {
            Address = new NewAddress {
                Country = CurrentEvent.Address.Country,
                Region = CurrentEvent.Address.Region,
                City = CurrentEvent.Address.City,
                Street = CurrentEvent.Address.Street,
                Building = CurrentEvent.Address.Building,
                Title = CurrentEvent.Address.Title
            };
        }
        if (CurrentEvent.StartTime > 0)
            StartDate = DateHelper.UnixTimeToDateTime(CurrentEvent.StartTime).ToString("yyyy-MM-dd");
        if (CurrentEvent.EndTime > 0)
            EndDate = DateHelper.UnixTimeToDateTime(CurrentEvent.EndTime).ToString("yyyy-MM-dd");
        
        return Page();
    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        var id = GetId();
        var path = SaveImage(NewEvent.Cover);
        var foundEvent = await _eventStorageService.GetAsync(Id, cancellationToken);
        if (foundEvent is null)
            return BadRequest();
        CurrentEvent = foundEvent;

        if (NewEvent.TypeId == 1)
            foreach (var name in typeof(NewAddress).GetProperties().Select(p => p.Name).ToArray())
                ModelState.Remove(name);

        var dates = GetDate(StartDate, EndDate);
        CurrentEvent.Name = NewEvent.Name;
        CurrentEvent.Description = NewEvent.Description;
        CurrentEvent.CoverUrl = path;
        CurrentEvent.TypeId = NewEvent.TypeId;
        CurrentEvent.CategoryId = NewEvent.CategoryId;
        CurrentEvent.AddressId = await AddAddressAsync(Address, cancellationToken);
        CurrentEvent.StartTime = dates.startDate;
        CurrentEvent.EndTime = dates.endDate;
        
        await _eventStorageService.UpdateAsync(Id, CurrentEvent, cancellationToken);
        return RedirectToPage("Event", new { id = Id });
    }

    public JsonResult OnPostCheckStartDate(string startDate)
    {
        return new JsonResult(ParseDate(startDate).Subtract(DateTime.Now).Days > 0);
    }

    public JsonResult OnPostCheckEndDate(string endDate, string? startDate)
    {
        if (startDate is not null)
            return new JsonResult(ParseDate(endDate).Subtract(ParseDate(startDate)).Days > 0);
        return OnPostCheckStartDate(endDate);
    }

    private async Task<int?> AddAddressAsync(NewAddress newAddress, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(newAddress.Country))
        {
            var address = new Address() {
                Country = Address.Country,
                Region = Address.Region,
                City = Address.City,
                Street = Address.Street,
                Building = Address.Building,
                Title = Address.Title
            };
            var entity = await _eventStorageService.AddAddressAsync(address, cancellationToken);
            return entity.Id;
        }
        return null;
    }

    private DateTime ParseDate(string date) =>
        DateTime.ParseExact(date, "yyyy-MM-dd", 
            System.Globalization.CultureInfo.InvariantCulture);

    private (long startDate, long endDate) GetDate(string? startDate, string? endDate) 
    {
        long parsedStart = 0;
        long parsedEnd = 0;
        if (startDate is not null)
            parsedStart = DateHelper.DateTimeToUnixTime(ParseDate(startDate));
        
        if (endDate is not null)
            parsedEnd = DateHelper.DateTimeToUnixTime(ParseDate(endDate));
        return (parsedStart, parsedEnd);
    }

    private int GetId() 
    {
        var id = User.FindFirst("Id")?.Value;
        if (id is null)
            throw new NullReferenceException();

        return int.Parse(id);
    }

    private string SaveImage(IFormFile? image) {
        if (image is not null)
        {
            string path = $"/Uploads/{image.FileName.GetHashCode()}";
            using (var fileStream = new FileStream($"{_appEnvironment.WebRootPath}/{path}", FileMode.Create))
            {
                image.CopyToAsync(fileStream);
            }
            return path;
        }
        return "/Uploads/placeholder.png";
    }
}
