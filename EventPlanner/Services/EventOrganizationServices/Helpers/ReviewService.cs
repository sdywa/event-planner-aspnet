using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.EventOrganizationServices;

public class ReviewService : CommonQueries<int, Review>
{
    private Context _context;

    public ReviewService(Context context)
        : base(context)
    {
        _context = context;
    }

    public async Task<Review?> GetAsync(int id) => await base.GetAsync(id, _context.Reviews);

    public async Task<Review?> GetBySaleAsync(int saleId)
    {
        var reviews = await base.GetAllAsync(_context.Reviews);
        return reviews.FirstOrDefault(r => r.SaleId == saleId);
    }

    public async Task<double> GetAverageRatingAsync(List<Event> events)
    {
        double rating = 0;
        foreach (var e in events)
        {
            var ratings = (await GetByEventAsync(e.Id)).Select(r => r.Rating);
            if (ratings.Count() != 0)
                if (rating == 0)
                    rating = ratings.Average();
                else
                    rating = (rating + ratings.Average()) / 2;
        }

        return rating == 0 ? 5 : rating;
    }

    public async Task<List<Review>> GetByEventAsync(int eventId) =>
        await _context.Reviews
            .Include(r => r.Sale)
            .ThenInclude(s => s.Ticket)
            .ThenInclude(t => t.Event)
            .Where(r => r.Sale.Ticket.EventId == eventId)
            .ToListAsync();
}
