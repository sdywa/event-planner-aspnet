using EventPlanner.Models;

namespace EventPlanner.Services.AdvertisingServices;

/// <summary>
/// Сервис аутентификации пользователей
/// </summary>
public interface IAdvertisingService
{
    Task<List<Event>> GetAdvertisingFromAsync(List<Event> events, int limit, int? userId);
}
