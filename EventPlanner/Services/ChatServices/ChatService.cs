using Microsoft.EntityFrameworkCore;
using EventPlanner.Exceptions;
using EventPlanner.Models;

namespace EventPlanner.Services.ChatServices;

public class EventChatService : CommonQueries<int, Message>, IChatService
{
    private Context _context;
    private CommonQueries<int, Chat> _common;

    public EventChatService(Context context) : base(context)
    {
        _context = context;
        _common = new CommonQueries<int, Chat>(context);
    }

    public async Task<Message?> GetAsync(int id) => await base.GetAsync(id, IncludeValues());
    public async Task<List<Message>> GetAllAsync() => await base.GetAllAsync(IncludeValues());

    public async Task<Chat> GetChatAsync(int id) {
        var chat = await _common.GetAsync(id, IncludeChatValues());
        if (chat == null)
            throw new ChatNotFoundException();
        return chat;
    }

    public async Task<List<Chat>> GetChatsAsync(int id) => await _common.GetAllAsync(IncludeChatValues());

    public async Task<Chat> CreateChatAsync(Chat chat) => await _common.CreateAsync(chat);

    public async Task<Chat> UpdateChatStatusAsync(int id, EventPlanner.ChatStatus status)
    {
        var chat = await _common.GetAsync(id, _context.Chats);
        if (chat == null)
            throw new ChatNotFoundException();
        chat.StatusId = status;
        await _common.UpdateAsync(chat);
        return chat;
    }

    private IQueryable<Message> IncludeValues() =>
        _context.Messages
            .Include(m => m.Chat)
                .ThenInclude(c => c.Event)
            .Include(m => m.Chat)
                .ThenInclude(c => c.Initiator)
            .Include(m => m.Chat)
                .ThenInclude(c => c.Status)
            .Include(m => m.Creator);

    private IQueryable<Chat> IncludeChatValues() =>
        _context.Chats
            .Include(c => c.Event)
            .Include(c => c.Initiator)
            .Include(c => c.Status)
            .Include(c => c.Messages)
                .ThenInclude(m => m.Creator);
}
