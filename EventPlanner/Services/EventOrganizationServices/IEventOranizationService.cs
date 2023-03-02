using EventPlanner.Models;

namespace EventPlanner.Services.EventOrganizationServices;

/// <summary>
/// Сервис организации мероприятий
/// </summary>
public interface IEventOrganizationService : IDataService<int, Sale>
{
    Task<Sale?> GetAsync(int userId, int eventId);
}
