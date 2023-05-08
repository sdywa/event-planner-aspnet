using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;
using EventPlanner.Services.EventStorageServices;

namespace EventPlanner.Services.EventOrganizationServices;

/// <summary>
/// Сервис организации мероприятий
/// </summary>
public class EventOrganizationService : CommonQueries<int, Sale>, IEventOrganizationService
{
    private Context _context;
    private IEventStorageService _eventStorageService;
    private ReviewService _reviewService;

    public EventOrganizationService(Context context, IEventStorageService eventStorageService) : base(context)
    {
        _context = context;
        _eventStorageService = eventStorageService;
        _reviewService = new ReviewService(_context);
    }

    public async Task<Sale?> GetAsync(int id) =>
        await base.GetAsync(id, _context.Sales);

    public async Task<Sale?> GetAsync(int userId, int eventId) =>
        await _context.Sales.Include(s => s.Ticket).FirstOrDefaultAsync(e => e.UserId == userId && e.Ticket.EventId == eventId);

    public async Task<List<Sale>> GetAllAsync() =>
        await base.GetAllAsync(_context.Sales);

    public async Task<List<Sale>> GetAllAsync(int userId) =>
        await _context.Sales.Include(s => s.Ticket).ThenInclude(t => t.Event).Where(e => e.UserId == userId).ToListAsync();

    public async Task<List<Sale>> GetAllByTicketAsync(int ticketId) =>
        await _context.Sales.Where(s => s.TicketId == ticketId).ToListAsync();

    public async Task<List<Sale>> GetAllByEventAsync(int eventId) =>
        await _context.Sales.Include(s => s.Ticket).Where(s => s.Ticket.EventId == eventId).ToListAsync();

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
        return await _reviewService.GetAverageRatingAsync(events);
    }

    public async Task<Review?> GetReviewBySaleAsync(int saleId) => await _reviewService.GetBySaleAsync(saleId);
    public async Task<Review> CreateAsync(Review entity) => await _reviewService.CreateAsync(entity);
}
