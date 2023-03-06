using EventPlanner.Models;

namespace EventPlanner.Services.UserServices;

/// <summary>
/// Сервис учёта пользователей
/// </summary>
public interface IUserService : IDataService<int, User> 
{
    Task<User?> GetByEmailAsync(string email);
}
