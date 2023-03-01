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
    private CommonQueries<int, Question> _commonQuestion;

    public EventStorageService(Context context)
    {
        _context = context;
        _common = new CommonQueries<int, Event>(_context);
        _commonAddress = new CommonQueries<int, Address>(_context);
        _commonQuestion = new CommonQueries<int, Question>(_context);
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

    public async Task<Address> CreateAddressAsync(Address entity) =>
        await _commonAddress.CreateAsync(entity);

    public async Task UpdateAddressAsync(Address entity) =>
        await _commonAddress.UpdateAsync(entity);

    public async Task<Question?> GetQuestionAsync(int id) =>
        await _commonQuestion.GetAsync(id, _context.Questions);

    public async Task<List<Question>> GetQuestionsByEventAcyns (int eventId) 
    {
        var e = await _context.Events.Include(e => e.Questions).FirstOrDefaultAsync(e => e.Id == eventId);
        if (e == null)
            return new List<Question>();
        return e.Questions.ToList();
    }

    public async Task<Question> CreateQuestionAsync(Question entity) =>
        await _commonQuestion.CreateAsync(entity);
    public async Task UpdateQuestionAsync(Question entity) =>
        await _commonQuestion.UpdateAsync(entity);
    public async Task DeleteQuestionAsync(int id) =>
        await _commonQuestion.DeleteAsync(id);

    private IQueryable<Event> IncludeValues() =>
        _context.Events
            .Include(e => e.Type)
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address);
}
