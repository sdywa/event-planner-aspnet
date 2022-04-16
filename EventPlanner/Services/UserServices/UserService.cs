using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.UserServices;

public class UserService : IUserService
{
    private PlannerContext _context;
    private CommonQueries<User> _common;
    private CommonQueries<FavEvent> _commonFavEvents;

    public UserService(PlannerContext context)
    {
        _context = context;
        _common = new CommonQueries<User>(_context);
        _commonFavEvents = new CommonQueries<FavEvent>(_context);
    }

    public async Task CreateAsync(User entity, CancellationToken cancellationToken) =>
        await _common.CreateAsync(entity, cancellationToken);

    public async Task<User?> GetAsync(int id, CancellationToken cancellationToken) =>
        await _common.GetAsync(id, IncludeValuesWithEvents(cancellationToken), cancellationToken);

    public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken) =>
        await _common.GetAllAsync(IncludeValues(cancellationToken), cancellationToken);

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var entity = await IncludeValues(cancellationToken)
            .FirstOrDefaultAsync(u => u.Email == email);
        return entity;
    }

    public async Task UpdateAsync(int id, User entity, CancellationToken cancellationToken) =>
        await _common.UpdateAsync(id, entity, cancellationToken);

    public async Task DeleteAsync(int id, CancellationToken cancellationToken) => 
        await _common.DeleteAsync(id, cancellationToken);

    public async Task CreateFavEventAsync(FavEvent favEvent, CancellationToken cancellationToken) =>
        await _commonFavEvents.CreateAsync(favEvent, cancellationToken);

    public async Task DeleteFavEventAsync(int id, CancellationToken cancellationToken) => 
        await _commonFavEvents.DeleteAsync(id, cancellationToken);

    private IQueryable<User> IncludeValues(
        CancellationToken cancellationToken) =>
        _context.Users
            .Include(u => u.Role);

    private IQueryable<User> IncludeValuesWithEvents(
        CancellationToken cancellationToken) =>
        _context.Users
            .Include(u => u.Role)
            .Include(u => u.FavEvents)
                .ThenInclude(f => f.Event)
                    .ThenInclude(e => e.Type)
            .Include(u => u.FavEvents)
                .ThenInclude(f => f.Event)
                    .ThenInclude(e => e.Category)
            .Include(u => u.FavEvents)
                .ThenInclude(f => f.Event)
                    .ThenInclude(e => e.Address)
            .Include(u => u.PreviousEvents)
                .ThenInclude(f => f.Event)
                    .ThenInclude(e => e.Type)
            .Include(u => u.PreviousEvents)
                .ThenInclude(f => f.Event)
                    .ThenInclude(e => e.Category)
            .Include(u => u.PreviousEvents)
                .ThenInclude(f => f.Event)
                    .ThenInclude(e => e.Address)
            .Include(u => u.CreatedEvents)
                .ThenInclude(e => e.Type)
            .Include(u => u.CreatedEvents)
                .ThenInclude(e => e.Category)
            .Include(u => u.CreatedEvents)
                .ThenInclude(e => e.Address);
}