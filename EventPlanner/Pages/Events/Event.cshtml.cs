using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Models;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Pages;

public class EventModel : PageModel
{
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }
    [BindProperty(SupportsGet = true)]
    public bool IsValid { get; set; } = true;
    public Event CurrentEvent { get; set; } = null!;
    public bool IsFavorite { get; set; }
    private PlannerContext _context;
    private IEventStorageService _eventStorageService;
    private IUserService _userService;

    public EventModel(PlannerContext context, IEventStorageService eventStorageService, IUserService userService)
    {
        _context = context;
        _eventStorageService = eventStorageService;
        _userService = userService;
    }

    public async Task<IActionResult> OnGetAsync(CancellationToken cancellationToken)
    {
        var currentEvent = await _eventStorageService.GetAsync(Id, cancellationToken);
        if (currentEvent is null)
            return NotFound();

        CurrentEvent = currentEvent;
        await _context.Entry(CurrentEvent).Collection(e => e.Participants).LoadAsync();

        int? id = null;
        try
        {
            id = GetId();
        }
        catch (NullReferenceException)
        {
            IsFavorite = false;
        }
        finally
        {
            var entity = await _userService.GetFavEventAsync(id ?? default, Id, cancellationToken);
            IsFavorite = entity is not null;
        }
        return Page();
    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        await _eventStorageService.DeleteAsync(Id, cancellationToken);
        return RedirectToPage("Events");
    }

    public async Task<IActionResult> OnPostAddFavAsync(CancellationToken cancellationToken)
    {
        var favEvent = new FavEvent 
        {
            UserId = GetId(),
            EventId = Id
        };
        await _userService.CreateFavEventAsync(favEvent, cancellationToken);
        IsFavorite = true;
        return RedirectToPage("Event", new { Id = Id });
    }

    public async Task<IActionResult> OnPostDeleteFavAsync(CancellationToken cancellationToken)
    {
        var entity = await _userService.GetFavEventAsync(GetId(), Id, cancellationToken);
        if (entity is null)
            return BadRequest();
        await _userService.DeleteFavEventAsync(entity.Id, cancellationToken);
        IsFavorite = false;
        return RedirectToPage("Event", new { Id = Id });
    }

    private int GetId() 
    {
        var id = User.FindFirst("Id")?.Value;
        if (id is null)
            throw new NullReferenceException();

        return int.Parse(id);
    }
}
