using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Helpers;
using EventPlanner.Models;
using EventPlanner.Models.Events;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;

namespace EventPlanner.Pages;

[Authorize(Roles = "Organizer")]
public class EditEventModel : EventFormModel
{
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }
    [BindProperty(SupportsGet = true)]
    public int IsValid { get; set; }
    public Event CurrentEvent { get; set; } = null!;
    private IEventOrganizationService _eventOrganizationService { get; set; }

    public EditEventModel(
        IWebHostEnvironment appEnvironment, 
        PlannerContext context, 
        IEventStorageService eventStorageService, 
        IEventOrganizationService eventOrganizationService) : base(
            "Изменить", 
            appEnvironment, 
            context, 
            eventStorageService)
    {
        _eventOrganizationService = eventOrganizationService;
    }

    public async override Task<IActionResult> OnGetAsync(CancellationToken cancellationToken)
    {
        await base.OnGetAsync(cancellationToken);
        var foundEvent = await _eventStorageService.GetAsync(Id, cancellationToken);
        if (foundEvent is null)
            return BadRequest();

        CurrentEvent = foundEvent;
        NewEvent = new NewEvent {
            Name = CurrentEvent.Name,
            Description = CurrentEvent.Description,
            TypeId = CurrentEvent.TypeId,
            CategoryId = CurrentEvent.CategoryId
        };
        if (CurrentEvent.Address is not null)
        {
            Address = new NewAddress {
                Country = CurrentEvent.Address.Country,
                Region = CurrentEvent.Address.Region,
                City = CurrentEvent.Address.City,
                Street = CurrentEvent.Address.Street,
                Building = CurrentEvent.Address.Building,
                Title = CurrentEvent.Address.Title
            };
        }
        if (CurrentEvent.StartTime > 0)
            StartDate = DateHelper.UnixTimeToDateTime(CurrentEvent.StartTime).ToString("yyyy-MM-dd");
        if (CurrentEvent.EndTime > 0)
            EndDate = DateHelper.UnixTimeToDateTime(CurrentEvent.EndTime).ToString("yyyy-MM-dd");
        
        return Page();
    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        var foundEvent = await _eventStorageService.GetAsync(Id, cancellationToken);
        if (foundEvent is null)
            return BadRequest();
        CurrentEvent = foundEvent;

        (int id, string path) = base.PrepareForm(cancellationToken);
        var dates = GetDate(StartDate, EndDate);
        CurrentEvent.Name = NewEvent.Name;
        CurrentEvent.Description = NewEvent.Description;
        if (NewEvent.Cover is not null)
            CurrentEvent.CoverUrl = path;
        CurrentEvent.TypeId = NewEvent.TypeId;
        CurrentEvent.CategoryId = NewEvent.CategoryId;
        CurrentEvent.AddressId = await AddAddressAsync(Address, cancellationToken);
        CurrentEvent.StartTime = dates.startDate;
        CurrentEvent.EndTime = dates.endDate;
        
        await _eventStorageService.UpdateAsync(Id, CurrentEvent, cancellationToken);
        return RedirectToPage("Event", new { id = Id });
    }
}
