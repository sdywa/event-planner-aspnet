using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Models;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Pages;

public class EventModel : PageModel
{
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }
    [BindProperty(SupportsGet = true)]
    public bool IsValid { get; set; } = true;
    public Event CurrentEvent { get; set; } = null!;
    private PlannerContext _context;
    private IEventStorageService _eventStorageService;

    public EventModel(PlannerContext context, IEventStorageService eventStorageService)
    {
        _context = context;
        _eventStorageService = eventStorageService;
    }

    public async Task<IActionResult> OnGetAsync(CancellationToken cancellationToken)
    {
        var currentEvent = await _eventStorageService.GetAsync(Id, cancellationToken);
        if (currentEvent is null)
            return NotFound();

        CurrentEvent = currentEvent;
        await _context.Entry(CurrentEvent).Collection(e => e.Participants).LoadAsync();
        return Page();
    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        await _eventStorageService.DeleteAsync(Id, cancellationToken);
        return RedirectToPage("Events");
    }
}
