using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.UserServices;

public class UserService : IUserService
{
    private Context _context;
    private CommonQueries<int, User> _common;

    public UserService(Context context)
    {
        _context = context;
        _common = new CommonQueries<int, User>(_context);
    }

    public async Task<User> CreateAsync(User entity) =>
        await _common.CreateAsync(entity);

    public async Task<User?> GetAsync(int id) =>
        await _common.GetAsync(id, IncludeValuesWithEvents());

    public async Task<List<User>> GetAllAsync() =>
        await _common.GetAllAsync(IncludeValues());

    public async Task<User?> GetByEmailAsync(string email)
    {
        var entity = await IncludeValues()
            .FirstOrDefaultAsync(u => u.Email == email);
        return entity;
    }

    public async Task UpdateAsync(User entity) =>
        await _common.UpdateAsync(entity);

    public async Task DeleteAsync(int id) => 
        await _common.DeleteAsync(id);

    private IQueryable<User> IncludeValues() =>
        _context.Users
            .Include(u => u.Role);

    private IQueryable<User> IncludeValuesWithEvents() => 
        IncludeValues()
            .Include(u => u.FavEvents)
                .ThenInclude(f => f.Event)
                    .ThenInclude(e => e.Type)
            .Include(u => u.FavEvents)
                .ThenInclude(f => f.Event)
                    .ThenInclude(e => e.Category);
}
