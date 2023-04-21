using EventPlanner.Models;

namespace EventPlanner.Services.AdvertisingServices;

/// <summary>
/// Сервис аутентификации пользователей
/// </summary>
public interface IAdvertisingService
{
    Task<List<Event>> GetAdvertisingFrom(List<Event> events, int limit, int? userId);
}
