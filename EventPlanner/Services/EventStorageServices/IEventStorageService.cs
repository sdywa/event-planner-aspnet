using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

/// <summary>
/// Сервис учёта мероприятий
/// </summary>
public interface IEventStorageService : IDataService<int, Event>
{
    Task<List<Event>> GetByCreatorAsync(int creatorId);
    Task<Address> CreateAddressAsync(Address entity);
    Task UpdateAddressAsync(Address entity);
    Task<Question?> GetQuestionAsync(int id);
    Task<List<Question>> GetQuestionsByEventAcyns (int eventId);
    Task<Question> CreateQuestionAsync(Question entity);
    Task UpdateQuestionAsync(Question entity);
    Task DeleteQuestionAsync(int id);
    Task<Ticket?> GetTicketAsync(int id);
    Task<List<Ticket>> GetTicketsByEventAcyns (int eventId);
    Task<Ticket> CreateTicketAsync(Ticket entity);
    Task UpdateTicketAsync(Ticket entity);
    Task DeleteTicketAsync(int id);
}
