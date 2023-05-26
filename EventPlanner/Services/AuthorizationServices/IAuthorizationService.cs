using EventPlanner.Models;

namespace EventPlanner.Services.AuthorizationService;

/// <summary>
/// Сервис авторизации пользователей
/// </summary>
public interface IAuthorizationService
{
    public Object GetAccessToken(User user);
    public Task<Object> GetRefreshTokenAsync(User user);
    public Task<Object> RefreshTokensAsync(User user, string refreshToken);
    public Task RemoveRefreshTokenAsync(User user, string refreshToken);
}
