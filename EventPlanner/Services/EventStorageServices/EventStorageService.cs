using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

public class EventStorageService : CommonQueries<int, Event>, IEventStorageService
{
    private Context _context;
    private AddressService _addressService;
    private QuestionService _questionService;
    private TicketService _ticketService;

    public EventStorageService(Context context) : base(context)
    {
        _context = context;
        _addressService = new AddressService(_context);
        _questionService = new QuestionService(_context);
        _ticketService = new TicketService(_context);
    }

    public async Task<Event?> GetAsync(int id) =>
        await base.GetAsync(id, IncludeValues());

    public async Task<List<Event>> GetByCreatorAsync(int creatorId)
    {
        var entities = await IncludeValues()
            .Where(e => e.CreatorId == creatorId)
            .ToListAsync();
        return entities;
    }

    public async Task<List<Event>> GetAllAsync() =>
        (await base.GetAllAsync(IncludeValues())).Where(e => e.Tickets.Count > 0).ToList();

    public async Task<List<Event>> GetAvailableAsync() =>
        (await GetAllAsync()).Where(e => e.StartDate > DateTime.Now).ToList();

    public async Task<Address> CreateAsync(Address entity) => await _addressService.CreateAsync(entity);
    public async Task UpdateAsync(Address entity) => await _addressService.UpdateAsync(entity);

    public async Task<Question?> GetQuestionAsync(int id) =>
        await _questionService.GetAsync(id);

    public async Task<List<Question>> GetQuestionsByEventAsync(int eventId) => await _questionService.GetByEventAsync(eventId);
    public async Task<Question> CreateAsync(Question entity) => await _questionService.CreateAsync(entity);
    public async Task UpdateAsync(Question entity) => await _questionService.UpdateAsync(entity);
    public async Task DeleteQuestionAsync(int id) => await _questionService.DeleteAsync(id);

    public async Task<Ticket?> GetTicketAsync(int id) => await _ticketService.GetAsync(id);
    public async Task<List<Ticket>> GetTicketsByEventAcyns(int eventId) => await _ticketService.GetByEventAsync(eventId);
    public async Task<Ticket> CreateAsync(Ticket entity) => await _ticketService.CreateAsync(entity);
    public async Task UpdateAsync(Ticket entity) => await _ticketService.UpdateAsync(entity);
    public async Task DeleteTicketAsync(int id) => await _ticketService.DeleteAsync(id);

    private IQueryable<Event> IncludeValues() =>
        _context.Events
            .Include(e => e.Type)
            .Include(e => e.Creator)
            .Include(e => e.Category)
            .Include(e => e.Address)
            .Include(e => e.Tickets);
}
