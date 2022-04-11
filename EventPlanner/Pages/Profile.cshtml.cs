using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using EventPlanner.Models;
using EventPlanner.Models.Profile;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Pages;

public class ProfileModel : PageModel
{
    [BindProperty]
    public UserProfile Profile { get; set; } = null!;

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

    public ProfileModel(PlannerContext context, IUserService userService)
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
        CurrentUser.FirstName = Profile.FirstName;
        CurrentUser.LastName = Profile.LastName;
        CurrentUser.Email = Email;
        if (Profile.Password is not null)
            CurrentUser.Password = BCrypt.Net.BCrypt.HashPassword(Profile.Password);
        await _userService.UpdateAsync(_id, CurrentUser, cancellationToken);
        return Page();
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
        return await this.OnGetAsync(cancellationToken);
    }

    public JsonResult OnPostCheckEmail()
    {
        var user = _context.Users.SingleOrDefault(u => u.Email == Profile.Email);
        return new JsonResult(user is null || user is not null && user.Id != _id);
    }
}
