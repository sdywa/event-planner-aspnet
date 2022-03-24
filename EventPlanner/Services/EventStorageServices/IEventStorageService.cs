using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

/// <summary>
/// Сервис учёта мероприятий
/// </summary>
public interface IEventStorageService : IDataService<Event>
{
    Task<List<Event>> GetByCreatorAsync(int creatorId, CancellationToken cancellationToken);
}