using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.UserServices;

public class UserService : CommonQueries<int, User>, IUserService
{
    private Context _context;

    public UserService(Context context)
        : base(context)
    {
        _context = context;
    }

    public async Task<User?> GetAsync(int id) => await base.GetAsync(id, IncludeValuesWithEvents());

    public async Task<List<User>> GetAllAsync() => await base.GetAllAsync(IncludeValues());

    public async Task<User?> GetByEmailAsync(string email)
    {
        var entity = await IncludeValues().FirstOrDefaultAsync(u => u.Email == email);
        return entity;
    }

    private IQueryable<User> IncludeValues() => _context.Users.Include(u => u.Role);

    private IQueryable<User> IncludeValuesWithEvents() =>
        IncludeValues()
            .Include(u => u.FavEvents)
            .ThenInclude(f => f.Event)
            .ThenInclude(e => e.Type)
            .Include(u => u.FavEvents)
            .ThenInclude(f => f.Event)
            .ThenInclude(e => e.Category)
            .Include(u => u.CreatedEvents)
            .ThenInclude(e => e.Type)
            .Include(u => u.CreatedEvents)
            .ThenInclude(e => e.Category)
            .Include(u => u.Sales)
            .ThenInclude(s => s.Ticket);
}
