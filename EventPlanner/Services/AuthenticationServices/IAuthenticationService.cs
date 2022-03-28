using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using EventPlanner.Models;

namespace EventPlanner.Services.AuthenticationServices;

/// <summary>
/// Сервис авторизации пользователей
/// </summary>
public interface IAuthenticationService 
{
    Task<User> LoginAsync(string email, string password, CancellationToken cancellationToken);
    Task RegisterAsync(
        string firstName, 
        string lastName, 
        string email, 
        string password, 
        int roleId, 
        CancellationToken cancellationToken);
}