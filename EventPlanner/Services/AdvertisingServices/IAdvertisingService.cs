using EventPlanner.Models;

namespace EventPlanner.Services.AdvertisingServices;

/// <summary>
/// Сервис аутентификации пользователей
/// </summary>
public interface IAdvertisingService 
{
    Task<List<Event>> GetAdvertising(int? userId, int limit);
}
