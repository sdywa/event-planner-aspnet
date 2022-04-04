using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using EventPlanner.Models;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Pages;

public class EventModel : PageModel
{
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }
    public Event CurrentEvent { get; set; } = null!;
    private IEventStorageService _eventStorageService;

    public EventModel(IEventStorageService eventStorageService)
    {
        _eventStorageService = eventStorageService;
    }

    public async Task<IActionResult> OnGetAsync(CancellationToken cancellationToken)
    {
        var currentEvent = await _eventStorageService.GetAsync(Id, cancellationToken);
        if (currentEvent is null)
            return NotFound();

        CurrentEvent = currentEvent;
        return Page();
    }
}
