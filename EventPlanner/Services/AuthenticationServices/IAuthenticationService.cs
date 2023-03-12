using EventPlanner.Models;

namespace EventPlanner.Services.AuthenticationServices;

/// <summary>
/// Сервис аутентификации пользователей
/// </summary>
public interface IAuthenticationService
{
    Task<User> LoginAsync(string email, string password);
    Task RegisterAsync(
        string firstName,
        string lastName,
        string email,
        string password,
        UserRole role);
    Task UpdatePasswordAsync(int userId, string password);
}
