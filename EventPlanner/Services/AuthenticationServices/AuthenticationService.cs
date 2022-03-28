using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
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

    public async Task<User> LoginAsync(
        string email, 
        string password, 
        CancellationToken cancellationToken)
    {
        var user = await _userService.GetByEmailAsync(email, cancellationToken);
        if (user is null)
            throw new NullReferenceException();

        if (BCrypt.Net.BCrypt.Verify(password, user.Password))
            return user;
        throw new InvalidPasswordException(email, password);
    }

    public async Task RegisterAsync(
        string firstName, 
        string lastName, 
        string email, 
        string password,
        int roleId, 
        CancellationToken cancellationToken)
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
        
        await _userService.CreateAsync(user, cancellationToken);
    }
}