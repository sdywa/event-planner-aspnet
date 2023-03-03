using EventPlanner.Models;

namespace EventPlanner.Services.EventOrganizationServices;

/// <summary>
/// Сервис организации мероприятий
/// </summary>
public interface IEventOrganizationService : IDataService<int, Sale>
{
    Task<List<Sale>> GetAllAsync(int userId);
    Task<Sale?> GetAsync(int userId, int eventId);
    Task<List<Review>> GetReviewsByEventAcync(int eventId);
    Task<Review?> GetReviewBySaleAcyns(int SaleId);
    Task<Review> CreateReviewAsync(Review entity);
}
