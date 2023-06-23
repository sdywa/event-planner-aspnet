using EventPlanner.Exceptions;
using EventPlanner.Models;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Services.AuthenticationServices;

public class AuthenticationService : IAuthenticationService
{
    private IUserService _userService;

    public AuthenticationService(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<User> LoginAsync(string email, string password)
    {
        var user = await _userService.GetByEmailAsync(email);
        if (user is null)
            throw new UserNotFoundException { PropertyName = nameof(email) };

        if (BCrypt.Net.BCrypt.Verify(password, user.Password))
            return user;
        throw new InvalidPasswordException { PropertyName = nameof(password) };
    }

    public async Task RegisterAsync(
        string name,
        string surname,
        string email,
        string password,
        UserRole roleId
    )
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User()
        {
            Name = name,
            Surname = surname,
            Email = email,
            Password = hashedPassword,
            RegTime = DateTime.Now,
            RoleId = roleId
        };

        await _userService.CreateAsync(user);
    }

    public async Task UpdatePasswordAsync(int userId, string password)
    {
        var user = await _userService.GetAsync(userId);

        if (user == null)
            return;

        user.Password = BCrypt.Net.BCrypt.HashPassword(password);
        await _userService.UpdateAsync(user);
    }
}
