using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using EventPlanner.Exceptions;
using EventPlanner.Models;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Services.AuthorizationService;

public class AuthorizationService : IAuthorizationService
{
    private Context _context;
    private IUserService _userService;

    public AuthorizationService(Context context, IUserService userService) {
        _context = context;
        _userService = userService;
    }

    private ClaimsIdentity GetIdentity(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimsIdentity.DefaultNameClaimType, user.Name),
            new Claim(ClaimTypes.Surname, user.Surname),
            new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role.Name)
        };
        ClaimsIdentity identity = new ClaimsIdentity(
            claims,
            "Token",
            ClaimsIdentity.DefaultNameClaimType,
            ClaimsIdentity.DefaultRoleClaimType);
        return identity;
    }

    public Object GetAccessToken(User user) {
        var identity = GetIdentity(user);
        var now = DateTime.UtcNow;
        var expires = now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME));
        var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            notBefore: now,
            claims: identity.Claims,
            expires: expires,
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
        );
        var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
        return new
        {
            Token = encodedJwt,
            Created = now,
            Expires = expires
        };
    }

    public async Task<Object> GetRefreshTokenAsync(User user) {
        var refreshToken = new RefreshToken
        {
            Id = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            Created = DateTime.Now,
            Expires = DateTime.Now.AddDays(2),
        };

        user.RefreshToken = refreshToken;
        await _userService.UpdateAsync(user);

        return new
        {
            Token = refreshToken.Id,
            Created = refreshToken.Created,
            Expires = refreshToken.Expires
        };
    }

    public async Task<Object> RefreshTokensAsync(User user, string refreshToken) {
        var foundUser = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.RefreshToken)
            .FirstOrDefaultAsync(u => u.Id == user.Id && u.RefreshTokenId == refreshToken);

        if (foundUser == null || foundUser.RefreshToken == null || foundUser.RefreshToken.Expires < DateTime.Now)
            throw new InvalidRefreshToken();

        var jwt = GetAccessToken(foundUser);
        var newRefreshToken = await GetRefreshTokenAsync(foundUser);
        return new
        {
            accessToken = jwt,
            refreshToken = newRefreshToken
        };
    }

    public async Task RemoveRefreshTokenAsync(User user, string refreshToken) {
        var foundUser = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.RefreshToken)
            .FirstOrDefaultAsync(u => u.Id == user.Id && u.RefreshTokenId == refreshToken);

        var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Id == refreshToken);

        if (foundUser == null || token == null)
            return;

        foundUser.RefreshToken = null;
        await _userService.UpdateAsync(user);

        _context.RefreshTokens.Remove(token);
        await _context.SaveChangesAsync();
    }
}
