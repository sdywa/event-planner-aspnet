using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models.Auth;

public class Login 
{
    [Required(ErrorMessage = "Введите e-mail")]
    [StringLength(50)]
    [EmailAddress(ErrorMessage = "Некорректный e-mail")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Введите пароль")]
    [StringLength(70)]
    public string Password { get; set; } = string.Empty;
}