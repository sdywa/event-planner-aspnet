using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

public class TicketService : CommonQueries<int, Ticket>
{
    private Context _context;

    public TicketService(Context context)
        : base(context)
    {
        _context = context;
    }

    public async Task<Ticket?> GetAsync(int id) => await base.GetAsync(id, _context.Tickets);

    public async Task<List<Ticket>> GetByEventAsync(int eventId)
    {
        var e = await _context.Events
            .Include(e => e.Tickets)
            .FirstOrDefaultAsync(e => e.Id == eventId);
        if (e == null)
            return new List<Ticket>();
        return e.Tickets.ToList();
    }
}
