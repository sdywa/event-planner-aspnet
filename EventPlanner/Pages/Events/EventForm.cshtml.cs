using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using EventPlanner.Helpers;
using EventPlanner.Models;
using EventPlanner.Models.Events;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;

namespace EventPlanner.Pages;

public class EventFormModel : PageModel
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
    public string ButtonName { get; set; } 
    private IWebHostEnvironment _appEnvironment;
    private PlannerContext _context;
    protected IEventStorageService _eventStorageService { get; set; }

    public EventFormModel(
        string buttonName,
        IWebHostEnvironment appEnvironment, 
        PlannerContext context, 
        IEventStorageService eventStorageService)
    {
        ButtonName = buttonName;
        _appEnvironment = appEnvironment;
        _context = context;
        _eventStorageService = eventStorageService;
    }

    public async virtual Task<IActionResult> OnGetAsync(CancellationToken cancellationToken)
    {
        await Task.Run(() => {
            Categories = _context.Categories.ToList();
            Types = _context.EventTypes.ToList();
        });
        return Page();
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

    protected (int userId, string path) PrepareForm(CancellationToken cancellationToken)
    {
        var id = GetId();
        var path = SaveImage(NewEvent.Cover);

        if (NewEvent.TypeId == 1)
            foreach (var name in typeof(NewAddress).GetProperties().Select(p => p.Name).ToArray())
                ModelState.Remove(name);

        return (id, path);
    }

    protected async Task<int?> AddAddressAsync(NewAddress newAddress, CancellationToken cancellationToken)
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

    protected DateTime ParseDate(string date) =>
        DateTime.ParseExact(date, "yyyy-MM-dd", 
            System.Globalization.CultureInfo.InvariantCulture);

    protected (long startDate, long endDate) GetDate(string? startDate, string? endDate) 
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
            string ex = System.IO.Path.GetExtension(image.FileName);
            string path = $"/Uploads/{Math.Abs(image.FileName.GetHashCode())}{ex}";
            using (var fileStream = new FileStream($"{_appEnvironment.WebRootPath}/{path}", FileMode.Create))
            {
                image.CopyToAsync(fileStream);
            }
            return path;
        }
        return "/Uploads/placeholder.png";
    }
}