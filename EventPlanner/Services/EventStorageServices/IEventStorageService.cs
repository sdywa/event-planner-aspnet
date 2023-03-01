using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

/// <summary>
/// Сервис учёта мероприятий
/// </summary>
public interface IEventStorageService : IDataService<int, Event>
{
    Task<List<Event>> GetByCreatorAsync(int creatorId);
    Task<Address> AddAddressAsync(Address entity);
    Task UpdateAddressAsync(Address entity);
}
