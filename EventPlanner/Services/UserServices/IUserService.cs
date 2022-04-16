using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using EventPlanner.Models;

namespace EventPlanner.Services.UserServices;

/// <summary>
/// Сервис учёта пользователей
/// </summary>
public interface IUserService : IDataService<User> 
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task CreateFavEventAsync(FavEvent favEvent, CancellationToken cancellationToken);
    Task DeleteFavEventAsync(int id, CancellationToken cancellationToken);
}