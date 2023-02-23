using EventPlanner.Models;

namespace EventPlanner.Services.AuthorizationService;

/// <summary>
/// Сервис авторизации пользователей
/// </summary>
public interface IAuthorizationService 
{
    public Object GetAccessToken(User user);
    public Task<RefreshToken> GetRefreshToken(User user);
    public Task<Object> RefreshTokens(User user, string refreshToken);
}