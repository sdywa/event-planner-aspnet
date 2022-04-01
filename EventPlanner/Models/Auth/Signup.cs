using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models.Auth;

public class Signup 
{
    [Required(ErrorMessage = "Введите имя")]
    [StringLength(30)]
    [MinLength(2, ErrorMessage = "Слишком короткое имя")]
    public string FirstName { get; set; } = string.Empty;
    [Required(ErrorMessage = "Введите фамилию")]
    [StringLength(45)]
    [MinLength(2, ErrorMessage = "Слишком короткая фамилия")]
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Введите пароль")]
    [StringLength(70)]
    [MinLength(8, ErrorMessage = "Слишком короткий пароль")]
    public string Password { get; set; } = string.Empty;
    [Required(ErrorMessage = "Введите пароль")]
    [StringLength(70)]
    [Compare(nameof(Password), ErrorMessage = "Пароли не совпадают")]
    public string PasswordConfirm { get; set; } = string.Empty;
    public int RoleId { get; set; } = 1;
}