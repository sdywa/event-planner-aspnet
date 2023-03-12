using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Services.EventOrganizationServices;

/// <summary>
/// Сервис организации мероприятий
/// </summary>
public class EventOrganizationService : IEventOrganizationService
{
    private Context _context;
    private CommonQueries<int, Sale> _common;
    private CommonQueries<int, Answer> _commonAnswer;
    private CommonQueries<int, Review> _commonReview;
    private IEventStorageService _eventStorageService;


    public EventOrganizationService(Context context, IEventStorageService eventStorageService)
    {
        _context = context;
        _common = new CommonQueries<int, Sale>(_context);
        _commonAnswer = new CommonQueries<int, Answer>(_context);
        _commonReview = new CommonQueries<int, Review>(_context);
        _eventStorageService = eventStorageService;
    }

    public async Task<Sale> CreateAsync(Sale entity)
    {
        return await _common.CreateAsync(entity);
    }

    public async Task<Sale?> GetAsync(int id) =>
        await _common.GetAsync(id, _context.Sales);

    public async Task<Sale?> GetAsync(int userId, int eventId) =>
        await _context.Sales.Include(s => s.Ticket).FirstOrDefaultAsync(e => e.UserId == userId && e.Ticket.EventId == eventId);

    public async Task<List<Sale>> GetAllAsync() =>
        await _common.GetAllAsync(_context.Sales);

    public async Task<List<Sale>> GetAllAsync(int userId) =>
        await _context.Sales.Include(s => s.Ticket).ThenInclude(t => t.Event).Where(e => e.UserId == userId).ToListAsync();

    public async Task<List<Sale>> GetAllByEventAsync(int eventId) =>
        await _context.Sales.Include(s => s.Ticket).Where(s => s.Ticket.EventId == eventId).ToListAsync();

    public async Task UpdateAsync(Sale entity) =>
        await _common.UpdateAsync(entity);

    public async Task DeleteAsync(int id) =>
        await _common.DeleteAsync(id);

    public async Task DeleteAsync(int userId, int eventId)
    {
        var entity = await GetAsync(userId, eventId);
        if (entity is null)
            throw new NullReferenceException();
        _context.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<double> GetAverageRatingAsync(int creatorId)
    {
        var events = await _eventStorageService.GetByCreatorAsync(creatorId);
        double rating = 0;

        foreach (var e in events)
        {
            var ratings = (await GetReviewsByEventAsync(e.Id))
            .Where(r => r.Sale.Ticket.Event.CreatorId == creatorId)
            .Select(r => r.Rating);
            if (ratings.Count() != 0)
                if (rating == 0)
                    rating = ratings.Average();
                else
                    rating = (rating + ratings.Average()) / 2;
        }

        return rating == 0 ? 5 : rating;
    }

    public async Task<List<Review>> GetReviewsByEventAsync(int eventId) =>
        await _context
            .Reviews
            .Include(r => r.Sale)
            .ThenInclude(s => s.Ticket)
            .ThenInclude(t => t.Event)
            .Where(r => r.Sale.Ticket.EventId == eventId)
            .ToListAsync();

    public async Task<Review?> GetReviewBySaleAsync(int saleId) =>
        await _context.Reviews.FirstOrDefaultAsync(r => r.SaleId == saleId);


    public async Task<Review> CreateReviewAsync(Review entity) =>
        await _commonReview.CreateAsync(entity);
}
