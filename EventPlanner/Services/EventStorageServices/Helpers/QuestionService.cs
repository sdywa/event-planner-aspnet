using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

public class QuestionService : CommonQueries<int, Question>
{
    private Context _context;

    public QuestionService(Context context) : base(context)
    {
        _context = context;
    }

    public async Task<Question?> GetAsync(int id) =>
        await base.GetAsync(id, _context.Questions);

    public async Task<List<Question>> GetByEventAsync(int eventId)
    {
        var e = await _context.Events.Include(e => e.Questions).FirstOrDefaultAsync(e => e.Id == eventId);
        if (e == null)
            return new List<Question>();
        return e.Questions.ToList();
    }
}
