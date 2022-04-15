using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Models;
using EventPlanner.Services.EventOrganizationServices;

namespace EventPlanner.Pages;

[Authorize]
public class ParticipantModel : PageModel
{
    [BindProperty]
    public int Id { get; set; }
    [BindProperty]
    public int UserId { get; set; }
    public IEventOrganizationService _eventOrganizationService { get; set; }

    public ParticipantModel(IEventOrganizationService eventOrganizationService)
    {
        _eventOrganizationService = eventOrganizationService;
    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        if (await _eventOrganizationService.GetAsync(UserId, Id, cancellationToken) is not null)
        {
            return RedirectToPage("Event", new { id = Id, isValid = false });
        }

        var participant = new Participant() {
            EventId = Id,
            UserId = UserId
        };
        
        await _eventOrganizationService.CreateAsync(participant, cancellationToken);
        return RedirectToPage("Event", new { id = Id });
    }

    public async Task<IActionResult> OnPostDeleteAsync(CancellationToken cancellationToken)
    {
        try 
        {
            await _eventOrganizationService.DeleteAsync(UserId, Id, cancellationToken);
        }
        catch (Exception)
        {
            return RedirectToPage("Event", new { id = Id, isValid = false });
        }
        return RedirectToPage("Event", new { id = Id });
    }
}
