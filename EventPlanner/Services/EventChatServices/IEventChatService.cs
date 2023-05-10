using EventPlanner.Models;

namespace EventPlanner.Services.EventChatServices;

/// <summary>
/// Сервис обращений мероприятия
/// </summary>
public interface IEventChatService : IDataService<int, Message>
{
    Task<Chat> GetChatAsync(int id);
    Task<List<Chat>> GetChatsAsync(int eventId);
    Task<Chat> CreateChatAsync(Chat chat);
    Task<Chat> UpdateChatStatusAsync(int id, EventPlanner.ChatStatus status);
}
