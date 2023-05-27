using EventPlanner.Models;

namespace EventPlanner.Services.ChatServices;

/// <summary>
/// Сервис обращений
/// </summary>
public interface IChatService : IDataService<int, Message>
{
    Task<Chat> GetChatAsync(int id);
    Task<List<Chat>> GetChatsByEventAsync(int eventId);
    Task<List<Chat>> GetChatsByCreatorAsync(int initiatorId);
    Task<Chat> CreateChatAsync(Chat chat);
    Task<Chat> UpdateChatStatusAsync(int id, EventPlanner.ChatStatus status);
}
