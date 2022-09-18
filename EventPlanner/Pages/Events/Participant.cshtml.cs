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
        var isValid = true;
        if (await _eventOrganizationService.GetAsync(UserId, Id, cancellationToken) is null)
        {
            var participant = new Participant() {
                EventId = Id,
                UserId = UserId
            };
            Console.WriteLine("aaaaaa");
            await _eventOrganizationService.CreateAsync(participant, cancellationToken);
        }

        
        return RedirectToPagePermanent("Event", new { id = Id, isValid = isValid });
    }

    public async Task<IActionResult> OnPostDeleteAsync(string returnUrl, CancellationToken cancellationToken)
    {
        var isValid = true;
        try 
        {
            await _eventOrganizationService.DeleteAsync(UserId, Id, cancellationToken);
        }
        catch (Exception)
        {
            isValid = false;
        }
        return RedirectToPagePermanent(returnUrl, new { id = Id, isValid = isValid });
    }
}
