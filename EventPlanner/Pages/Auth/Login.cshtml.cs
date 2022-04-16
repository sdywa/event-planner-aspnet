using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using EventPlanner.Exceptions;
using EventPlanner.Models;
using EventPlanner.Models.Auth;
using EventPlanner.Services.AuthenticationServices;

namespace EventPlanner.Pages.Auth;

public class LoginModel : PageModel
{
    [BindProperty]
    public Login Login { get; set; } = null!;
    private PlannerContext _context;
    private EventPlanner.Services.AuthenticationServices.IAuthenticationService _authenticationService;

    public LoginModel(
        PlannerContext context, 
        EventPlanner.Services.AuthenticationServices.IAuthenticationService authenticationService)
    {
        _context = context;
        _authenticationService = authenticationService;
    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return Page();
        
        var userTask = _authenticationService.LoginAsync(Login.Email, Login.Password, cancellationToken);
        User user = null!;
        try 
        {
            user = await userTask;
        }
        catch (Exception)
        {
            ModelState.AddModelError("AuthError", "Email или пароль введены некорретно");
            return Page();
        }
        finally 
        {
            if (user != null)
                await Authenticate(user.Id.ToString(), user.Email, user.FirstName, user.Role.Name);
        }
        return RedirectToPage("/Events/Events");
    }

    private async Task Authenticate(string id, string email, string firstName, string role)
    {
        var claims = new List<Claim>
        {
            new Claim("Id", id),
            new Claim(ClaimsIdentity.DefaultNameClaimType, email),
            new Claim("FirstName", firstName),
            new Claim(ClaimsIdentity.DefaultRoleClaimType, role)
        };
        ClaimsIdentity identity = new ClaimsIdentity(claims, "ApplicationCookie", 
            ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }
}

