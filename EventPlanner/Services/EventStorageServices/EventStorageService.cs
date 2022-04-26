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
    private CommonQueries<Address> _commonAddress;

    public EventStorageService(PlannerContext context)
    {
        _context = context;
        _common = new CommonQueries<Event>(_context);
        _commonAddress = new CommonQueries<Address>(_context);
    }

    public async Task<Event> CreateAsync(Event entity, CancellationToken cancellationToken) =>
        await _common.CreateAsync(entity, cancellationToken);

    public async Task<Event?> GetAsync(int id, CancellationToken cancellationToken) =>
        await _common.GetAsync(id, IncludeValuesWithParticipants(cancellationToken), cancellationToken);

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

    public async Task<Address> AddAddressAsync(Address entity, CancellationToken cancellationToken) =>
        await _commonAddress.CreateAsync(entity, cancellationToken);

    private IQueryable<Event> IncludeValues(
        CancellationToken cancellationToken) =>
        _context.Events
            .Include(e => e.Type)
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address);

    private IQueryable<Event> IncludeValuesWithParticipants(
        CancellationToken cancellationToken) =>
        IncludeValues(cancellationToken)
            .Include(e => e.Participants)
                .ThenInclude(p => p.User);
}