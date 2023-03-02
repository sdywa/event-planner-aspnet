using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.EventOrganizationServices;

/// <summary>
/// Сервис организации мероприятий
/// </summary>
public class EventOrganizationService : IEventOrganizationService
{
    private Context _context;
    private CommonQueries<int, Sale> _common;
    private CommonQueries<int, Answer> _commonAnswer;

    public EventOrganizationService(Context context) 
    {
        _context = context;
        _common = new CommonQueries<int, Sale>(_context);
        _commonAnswer = new CommonQueries<int, Answer>(_context);
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
}
