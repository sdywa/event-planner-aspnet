using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

/// <summary>
/// Сервис учёта мероприятий
/// </summary>
public interface IEventStorageService : IDataService<int, Event>
{
    Task<Event> GetByIdAsync(int id);
    Task<List<Event>> GetAvailableAsync();
    Task<List<Event>> GetByCreatorAsync(int creatorId);
    Task<Address> CreateAsync(Address entity);
    Task UpdateAsync(Address entity);
    Task<Question?> GetQuestionAsync(int id);
    Task<List<Question>> GetQuestionsByEventAsync (int eventId);
    Task<Question> CreateAsync(Question entity);
    Task UpdateAsync(Question entity);
    Task DeleteQuestionAsync(int id);
    Task<Ticket?> GetTicketAsync(int id);
    Task<List<Ticket>> GetTicketsByEventAcyns (int eventId);
    Task<Ticket> CreateAsync(Ticket entity);
    Task UpdateAsync(Ticket entity);
    Task DeleteTicketAsync(int id);
}
