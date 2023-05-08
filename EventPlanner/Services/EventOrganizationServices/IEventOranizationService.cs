using EventPlanner.Models;

namespace EventPlanner.Services.EventOrganizationServices;

/// <summary>
/// Сервис организации мероприятий
/// </summary>
public interface IEventOrganizationService : IDataService<int, Sale>
{
    Task<List<Sale>> GetAllAsync(int userId);
    Task<Sale?> GetAsync(int userId, int eventId);
    Task<List<Sale>> GetAllByTicketAsync(int ticketId);
    Task<List<Sale>> GetAllByEventAsync(int eventId);
    Task<double> GetAverageRatingAsync(int userId);
    Task<Review?> GetReviewBySaleAsync(int SaleId);
    Task<Review> CreateAsync(Review entity);
}
