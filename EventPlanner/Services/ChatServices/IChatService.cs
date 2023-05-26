using EventPlanner.Models;

namespace EventPlanner.Services.ChatServices;

/// <summary>
/// Сервис обращений
/// </summary>
public interface IChatService : IDataService<int, Message>
{
    Task<Chat> GetChatAsync(int id);
    Task<List<Chat>> GetChatsAsync(int eventId);
    Task<Chat> CreateChatAsync(Chat chat);
    Task<Chat> UpdateChatStatusAsync(int id, EventPlanner.ChatStatus status);
}
