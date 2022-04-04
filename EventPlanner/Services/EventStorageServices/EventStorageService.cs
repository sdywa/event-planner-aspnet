using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

public class EventStorageService : IEventStorageService
{
    private PlannerContext _context;

    public EventStorageService(PlannerContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(Event entity, CancellationToken cancellationToken)
    {
        await _context.Events.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<Event?> GetAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _context.Events
            .Include(e => e.Type)
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address)
            .FirstOrDefaultAsync(e => e.EventId == id);
        return entity;
    }

    public async Task<List<Event>> GetAllAsync(CancellationToken cancellationToken)
    {
        var entities = await _context.Events
            .Include(e => e.Type)            
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address)
            .ToListAsync();
        return entities;
    }

    public async Task<List<Event>> GetByCreatorAsync(int creatorId, CancellationToken cancellationToken)
    {
        var entities = await _context.Events
            .Include(e => e.Type)
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address)
            .Where(e => e.CreatorId == creatorId)
            .ToListAsync();
        return entities;
    }

    public async Task UpdateAsync(int id, Event entity, CancellationToken cancellationToken)
    {
        entity.EventId = id;
        _context.Events.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _context.Set<Event>().FirstOrDefaultAsync((e) => e.EventId == id);
        if (entity is null)
            throw new NullReferenceException();
        _context.Events.Remove(entity);
        await _context.SaveChangesAsync();
    }
}