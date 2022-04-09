using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;
using EventPlanner.Services;

namespace EventPlanner.Services.EventStorageServices;

public class EventStorageService : IEventStorageService
{
    private PlannerContext _context;
    private CommonQueries<Event> _common;

    public EventStorageService(PlannerContext context)
    {
        _context = context;
        _common = new CommonQueries<Event>(_context);
    }

    public async Task CreateAsync(Event entity, CancellationToken cancellationToken) =>
        await _common.CreateAsync(entity, cancellationToken);

    public async Task<Event?> GetAsync(int id, CancellationToken cancellationToken) =>
        await _common.GetAsync(id, IncludeValues(cancellationToken), cancellationToken);

    public async Task<List<Event>> GetAllAsync(CancellationToken cancellationToken) =>
        await _common.GetAllAsync(IncludeValues(cancellationToken), cancellationToken);

    public async Task<List<Event>> GetByCreatorAsync(int creatorId, CancellationToken cancellationToken)
    {
        var entities = await IncludeValues(cancellationToken)
            .Where(e => e.CreatorId == creatorId)
            .ToListAsync();
        return entities;
    }

    public async Task UpdateAsync(int id, Event entity, CancellationToken cancellationToken) =>
        await _common.UpdateAsync(id, entity, cancellationToken);

    public async Task DeleteAsync(int id, CancellationToken cancellationToken) => 
        await _common.DeleteAsync(id, cancellationToken);

    private IQueryable<Event> IncludeValues(
        CancellationToken cancellationToken) =>
        _context.Events
            .Include(e => e.Type)
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address);
}