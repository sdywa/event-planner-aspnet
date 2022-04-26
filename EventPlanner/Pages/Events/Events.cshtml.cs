using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Models;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Pages;

public class EventsModel : PageModel
{
    [BindProperty(SupportsGet = true)]
    public string? Search { get; set; }
    [BindProperty(SupportsGet = true)]
    public string? Category { get; set; }
    public List<Event> Events { get; set; } = null!;
    public List<Category> Categories { get; set; } = null!;
    private PlannerContext _context;
    private IEventStorageService _eventStorageService;

    public EventsModel(PlannerContext context, IEventStorageService eventStorageService)
    {
        _context = context;
        _eventStorageService = eventStorageService;
    }

    public async Task OnGet(CancellationToken cancellationToken)
    {
        Categories = _context.Categories.ToList();
        Events = await _eventStorageService.GetAllAsync(cancellationToken);
        if (Search is not null)
        {
            Search = Search.ToLower();
            Events = Events
                .Where(e => e.Name.ToLower().Contains(Search) || 
                    e.Description.ToLower().Contains(Search))
                .ToList();
        }

        Console.WriteLine(Category);

        if (Category is not null && Category != "All")
            Events = Events
                .Where(e => e.Category.Name == Category)
                .ToList();
    }
}