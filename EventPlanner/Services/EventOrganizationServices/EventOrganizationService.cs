using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.EventOrganizationServices;

/// <summary>
/// Сервис организации мероприятий
/// </summary>
public class EventOrganizationService : IEventOrganizationService
{
    private PlannerContext _context;
    private CommonQueries<Participant> _common;

    public EventOrganizationService(PlannerContext context) 
    {
        _context = context;
        _common = new CommonQueries<Participant>(_context);
    }

    public async Task CreateAsync(Participant entity, CancellationToken cancellationToken) =>
        await _common.CreateAsync(entity, cancellationToken);

    public async Task<Participant?> GetAsync(int id, CancellationToken cancellationToken) =>
        await _common.GetAsync(id, _context.Participants, cancellationToken);

    public async Task<Participant?> GetAsync(int userId, int eventId, CancellationToken cancellationToken) =>
        await _context.Participants.FirstOrDefaultAsync(e => e.UserId == userId && e.EventId == eventId, cancellationToken);

    public async Task<List<Participant>> GetAllAsync(CancellationToken cancellationToken) =>
        await _common.GetAllAsync(_context.Participants, cancellationToken);

    public async Task UpdateAsync(int id, Participant entity, CancellationToken cancellationToken) =>
        await _common.UpdateAsync(id, entity, cancellationToken);

    public async Task DeleteAsync(int id, CancellationToken cancellationToken) => 
        await _common.DeleteAsync(id, cancellationToken);

    public async Task DeleteAsync(int userId, int eventId, CancellationToken cancellationToken)
    {
        var entity = await GetAsync(userId, eventId, cancellationToken);
        if (entity is not null)
        {
            _context.Remove(entity);
            await _context.SaveChangesAsync();
        }
        else
        {
            throw new NullReferenceException();
        }
    }
}