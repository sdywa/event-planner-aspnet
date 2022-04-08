using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using EventPlanner.Models;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Pages;

public class EventsModel : PageModel
{
    public List<Event> Events { get; set; } = null!;
    private IEventStorageService _eventStorageService;

    public EventsModel(IEventStorageService eventStorageService)
    {
        _eventStorageService = eventStorageService;
    }

    public async Task OnGet(CancellationToken cancellationToken)
    {
        Events = await _eventStorageService.GetAllAsync(cancellationToken);
    }
}
