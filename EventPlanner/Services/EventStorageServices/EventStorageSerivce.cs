using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;
using EventPlanner.Services;

namespace EventPlanner.Services.EventStorageServices;

public class EventStorageService : IEventStorageService
{
    private Context _context;
    private CommonQueries<int, Event> _common;
    private CommonQueries<int, Address> _commonAddress;

    public EventStorageService(Context context)
    {
        _context = context;
        _common = new CommonQueries<int, Event>(_context);
        _commonAddress = new CommonQueries<int, Address>(_context);
    }

    public async Task<Event> CreateAsync(Event entity) =>
        await _common.CreateAsync(entity);

    public async Task<Event?> GetAsync(int id) =>
        await _common.GetAsync(id, IncludeValues());

    public async Task<List<Event>> GetAllAsync() =>
        await _common.GetAllAsync(IncludeValues());

    public async Task<List<Event>> GetByCreatorAsync(int creatorId)
    {
        var entities = await IncludeValues()
            .Where(e => e.CreatorId == creatorId)
            .ToListAsync();
        return entities;
    }

    public async Task UpdateAsync(Event entity) =>
        await _common.UpdateAsync(entity);

    public async Task DeleteAsync(int id) => 
        await _common.DeleteAsync(id);

    public async Task<Address> AddAddressAsync(Address entity) =>
        await _commonAddress.CreateAsync(entity);

    private IQueryable<Event> IncludeValues() =>
        _context.Events
            .Include(e => e.Type)
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address);
}
