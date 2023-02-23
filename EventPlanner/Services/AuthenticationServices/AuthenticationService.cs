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
            throw new UserNotFoundException();

        if (BCrypt.Net.BCrypt.Verify(password, user.Password))
            return user;
        throw new InvalidPasswordException();
    }

    public async Task RegisterAsync(
        string firstName, 
        string lastName, 
        string email, 
        string password,
        UserRole roleId)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User() {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Password = hashedPassword,
            RegTime = DateTimeOffset.Now.ToUnixTimeSeconds(),
            RoleId = roleId
        };
        
        await _userService.CreateAsync(user);
    }
}
