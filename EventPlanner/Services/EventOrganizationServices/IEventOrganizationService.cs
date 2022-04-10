using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using EventPlanner.Models;

namespace EventPlanner.Services.EventOrganizationServices;

/// <summary>
/// Сервис организации мероприятий
/// </summary>
public interface IEventOrganizationService : IDataService<Participant>
{
    Task<Participant?> GetAsync(int userId, int eventId, CancellationToken cancellationToken);
    Task DeleteAsync(int userId, int eventId, CancellationToken cancellationToken);
}