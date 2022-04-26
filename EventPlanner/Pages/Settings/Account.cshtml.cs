using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using EventPlanner.Models;
using EventPlanner.Models.Profile;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Pages.Settings;

[Authorize]
public class AccountModel : PageModel
{
    [BindProperty]
    public UserProfile Account { get; set; } = null!;

    [BindProperty]
    [Required(ErrorMessage = "Введите e-mail")]
    [StringLength(50)]
    [EmailAddress(ErrorMessage = "Некорректный e-mail")]
    [PageRemote(
        PageHandler = "CheckEmail", 
        HttpMethod = "post", 
        ErrorMessage = "Такой e-mail уже используется",
        AdditionalFields = "__RequestVerificationToken")]
    public string Email { get; set; } = null!;
    public User? CurrentUser { get; set; }
    private PlannerContext _context;
    private IUserService _userService;
    private int _id;

    public AccountModel(PlannerContext context, IUserService userService)
    {
        _context = context;
        _userService = userService;
    }

    public async Task<IActionResult> OnGetAsync(CancellationToken cancellationToken)
    {
        ModelState.Clear();
        var id = User.FindFirst("Id")?.Value;
        if (id is null)
            return BadRequest();

        _id = int.Parse(id);
        CurrentUser = await _userService.GetAsync(_id, cancellationToken);
        Email = CurrentUser?.Email ?? string.Empty;
        return Page();
    }
    
    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return await this.OnGetAsync(cancellationToken);

        var id = User.FindFirst("Id")?.Value;
        if (id is null)
            return BadRequest();
        
        _id = int.Parse(id);
        CurrentUser = await _userService.GetAsync(int.Parse(id), cancellationToken);

        if (CurrentUser is null)
            return BadRequest();
            
        CurrentUser.FirstName = Account.FirstName;
        CurrentUser.LastName = Account.LastName;
        CurrentUser.Email = Email;
        if (Account.Password is not null)
            CurrentUser.Password = BCrypt.Net.BCrypt.HashPassword(Account.Password);
        await _userService.UpdateAsync(_id, CurrentUser, cancellationToken);

        var claims = new List<Claim>
        {
            new Claim("Id", id),
            new Claim(ClaimsIdentity.DefaultNameClaimType, CurrentUser.Email),
            new Claim("FirstName", CurrentUser.FirstName),
            new Claim(ClaimsIdentity.DefaultRoleClaimType, CurrentUser.Role.Name)
        };
        await Reauthenticate(claims);

        return RedirectToPage("Account");
    }

    public async Task<IActionResult> OnPostChangeRoleAsync(CancellationToken cancellationToken)
    {
        var id = User.FindFirst("Id")?.Value;
        if (id is null)
            return BadRequest();
        _id = int.Parse(id);
        CurrentUser = await _userService.GetAsync(_id, cancellationToken);
        if (CurrentUser is null)
            return BadRequest();
        CurrentUser.RoleId = 2;
        await _userService.UpdateAsync(_id, CurrentUser, cancellationToken);
        CurrentUser = await _userService.GetAsync(_id, cancellationToken);
        if (CurrentUser is null)
            return BadRequest();

        var identity = User.Identity as ClaimsIdentity;
        if (identity is null)
            return BadRequest();
        
        var claim = User.FindFirst(ClaimTypes.Role);
        if (claim is not null)
            identity.RemoveClaim(claim);

        identity.AddClaim(new Claim(ClaimsIdentity.DefaultRoleClaimType, CurrentUser.Role.Name));
        await Reauthenticate(identity.Claims);

        return await this.OnGetAsync(cancellationToken);
    }

    public JsonResult OnPostCheckEmail()
    {
        var user = _context.Users.SingleOrDefault(u => u.Email == Account.Email);
        return new JsonResult(user is null || user is not null && user.Id != _id);
    }

    private async Task Reauthenticate(IEnumerable<Claim> claims)
    {
        await HttpContext.SignOutAsync();
        ClaimsIdentity identity = new ClaimsIdentity(claims, "ApplicationCookie", 
            ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }
}
