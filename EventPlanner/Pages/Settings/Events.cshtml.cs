using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Models;
using EventPlanner.Models.Profile;
using EventPlanner.Services.UserServices;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Pages.Settings;

[Authorize]
public class EventsModel : PageModel
{
    public List<Event> FavouriteEvents { get; set; } = null!;
    public List<Event> PreviousEvents { get; set; } = null!;
    public List<Event> CreatedEvents { get; set; } = null!;
    private PlannerContext _context;
    private IUserService _userService;

    public EventsModel(PlannerContext context, IUserService userService)
    {
        _context = context;
        _userService = userService;
    }

    public async Task<IActionResult> OnGetAsync(CancellationToken cancellationToken)
    {
        ModelState.Clear();
        var id = User.FindFirst("Id")?.Value;
        if (id is null)
            return BadRequest();

        var parsedId = int.Parse(id);
        var user = await _userService.GetAsync(parsedId, cancellationToken);
        if (user is null)
            return BadRequest();
        
        FavouriteEvents = user.FavEvents.Select((e) => e.Event).ToList();
        PreviousEvents = user.PreviousEvents.Select((e) => e.Event).ToList();
        CreatedEvents = user.CreatedEvents.ToList();
        
        return Page();
    }
}
