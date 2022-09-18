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

namespace EventPlanner.Pages;

[Authorize(Roles = "Organizer")]
public class NewEventModel : EventFormModel
{
    public NewEventModel(
        IWebHostEnvironment appEnvironment, 
        PlannerContext context, 
        IEventStorageService eventStorageService) : base(
            "Создать", 
            appEnvironment, 
            context, 
            eventStorageService)
    {

    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        (int id, string path) = base.PrepareForm(cancellationToken);
        var addressId = await AddAddressAsync(Address, cancellationToken);
        var dates = GetDate(StartDate, EndDate);
        var newEvent = new Event() {
            Name = NewEvent.Name,
            Description = NewEvent.Description,
            CreationTime = DateTimeOffset.Now.ToUnixTimeSeconds(),
            CoverUrl = path,
            TypeId = NewEvent.TypeId,
            CreatorId = id,
            CategoryId = NewEvent.CategoryId,
            AddressId = addressId,
            StartTime = dates.startDate,
            EndTime = dates.endDate
        };
        
        var created = await _eventStorageService.CreateAsync(newEvent, cancellationToken);
        return RedirectToPage("Event", new { id = created.Id });
    }
}
