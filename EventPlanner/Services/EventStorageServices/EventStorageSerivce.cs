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
    private CommonQueries<int, Ticket> _commonTicket;

    public EventStorageService(Context context)
    {
        _context = context;
        _common = new CommonQueries<int, Event>(_context);
        _commonAddress = new CommonQueries<int, Address>(_context);
        _commonQuestion = new CommonQueries<int, Question>(_context);
        _commonTicket = new CommonQueries<int, Ticket>(_context);
    }

    public async Task<Event> CreateAsync(Event entity) =>
        await _common.CreateAsync(entity);

    public async Task<Event?> GetAsync(int id) =>
        await _common.GetAsync(id, IncludeValues());

    public async Task<List<Event>> GetAllAsync() =>
        (await _common.GetAllAsync(IncludeValues())).Where(e => e.Tickets.Count > 0).ToList();

    public async Task<List<Event>> GetAllAvailableAsync() =>
        (await GetAllAsync()).Where(e => e.EndDate == null || e.EndDate > DateTime.Now).ToList();

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

    public async Task<List<Question>> GetQuestionsByEventAcyns(int eventId)
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

    public async Task<Ticket?> GetTicketAsync(int id) =>
        await _commonTicket.GetAsync(id, _context.Tickets);

    public async Task<List<Ticket>> GetTicketsByEventAcyns(int eventId)
    {
        var e = await _context.Events.Include(e => e.Tickets).FirstOrDefaultAsync(e => e.Id == eventId);
        if (e == null)
            return new List<Ticket>();
        return e.Tickets.ToList();
    }

    public async Task<Ticket> CreateTicketAsync(Ticket entity) =>
        await _commonTicket.CreateAsync(entity);
    public async Task UpdateTicketAsync(Ticket entity) =>
        await _commonTicket.UpdateAsync(entity);
    public async Task DeleteTicketAsync(int id) =>
        await _commonTicket.DeleteAsync(id);

    private IQueryable<Event> IncludeValues() =>
        _context.Events
            .Include(e => e.Type)
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address)
            .Include(e => e.Tickets);
}
