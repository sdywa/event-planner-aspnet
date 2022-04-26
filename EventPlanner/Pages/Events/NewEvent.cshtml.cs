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

namespace EventPlanner.Pages;

[Authorize(Roles = "Organizer")]
public class NewEventModel : PageModel
{
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
    private IWebHostEnvironment _appEnvironment;
    private PlannerContext _context;
    private IEventStorageService _eventStorageService { get; set; }

    public NewEventModel(IWebHostEnvironment appEnvironment, PlannerContext context, IEventStorageService eventStorageService)
    {
        _appEnvironment = appEnvironment;
        _context = context;
        _eventStorageService = eventStorageService;
    }

    public void OnGet(CancellationToken cancellationToken)
    {
        Categories = _context.Categories.ToList();
        Types = _context.EventTypes.ToList();
    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        var id = GetId();
        var path = SaveImage(NewEvent.Cover);

        if (NewEvent.TypeId == 1)
            foreach (var name in typeof(NewAddress).GetProperties().Select(p => p.Name).ToArray())
                ModelState.Remove(name);

        var addressId = await AddAddressAsync(Address, cancellationToken);
        var dates = GetDate(StartDate, EndDate);
        var newEvent = new Event() {
            Name = NewEvent.Name,
            Description = NewEvent.Description,
            CreationTime = DateTimeOffset.Now.ToUnixTimeSeconds(),
            CoverUrl = path,
            TypeId = NewEvent.TypeId,
            CreatorId = id,
            CategoryId = NewEvent.CategoryId,
            AddressId = addressId,
            StartTime = dates.startDate,
            EndTime = dates.endDate
        };
        
        var created = await _eventStorageService.CreateAsync(newEvent, cancellationToken);
        return RedirectToPage("Event", new { id = created.Id });
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
