using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Models;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Pages;

public class EventsModel : PageModel
{
    public List<Event> Events { get; set; } = null!;
    public List<Category> Categories { get; set; } = null!;
    public string Category { get; set; } = null!;
    private PlannerContext _context;
    private IEventStorageService _eventStorageService;

    public EventsModel(PlannerContext context, IEventStorageService eventStorageService)
    {
        _context = context;
        _eventStorageService = eventStorageService;
    }

    public async Task OnGet(CancellationToken cancellationToken)
    {
        Events = await _eventStorageService.GetAllAsync(cancellationToken);
        Categories = _context.Categories.ToList();
    }
}
