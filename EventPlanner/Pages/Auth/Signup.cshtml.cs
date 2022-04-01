using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using EventPlanner.Models;
using EventPlanner.Models.Auth;
using EventPlanner.Services.AuthenticationServices;

namespace EventPlanner.Pages.Auth;

public class SignupModel : PageModel
{
    [BindProperty]
    public Signup Signup { get; set; } = null!;

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

    private PlannerContext _context;
    private IAuthenticationService _authenticationService;

    public SignupModel(PlannerContext context, IAuthenticationService authenticationService)
    {
        _context = context;
        _authenticationService = authenticationService;
    }

    public async Task<IActionResult> OnPostAsync(CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return Page();
        Console.WriteLine("Im here!");
        Signup.Email = Email;
        await _authenticationService.RegisterAsync(
            Signup.FirstName, 
            Signup.LastName, 
            Signup.Email, 
            Signup.Password, 
            Signup.RoleId, 
            cancellationToken);

        return RedirectToPage("./Login");
    }

    public JsonResult OnPostCheckEmail()
    {
        return new JsonResult(_context.Users.SingleOrDefault(u => u.Email == Signup.Email) == null);
    }
}

