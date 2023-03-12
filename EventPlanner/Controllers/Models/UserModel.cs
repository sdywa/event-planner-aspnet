using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Controllers.Models;

public class UserModel {
    [Required(ErrorMessage = "Укажите имя")]
    [StringLength(30, ErrorMessage = "Используйте менее 30 символов")]
    [MinLength(2, ErrorMessage = "Используйте не менее 2 символов")]
    public string Name { get; set; } = string.Empty;
    [Required(ErrorMessage = "Укажите фамилию")]
    [StringLength(45, ErrorMessage = "Используйте менее 45 символов")]
    [MinLength(2, ErrorMessage = "Используйте не менее 2 символов")]
    public string Surname { get; set; } = string.Empty;
    [Required(ErrorMessage = "Укажите email")]
    [StringLength(50, ErrorMessage = "Используйте менее 50 символов")]
    [EmailAddress(ErrorMessage = "Некорректный email")]
    public string Email { get; set; } = string.Empty;
    [StringLength(70, ErrorMessage = "Используйте менее 70 символов")]
    public string? Password { get; set; } = string.Empty;
    [StringLength(70, ErrorMessage = "Используйте менее 70 символов")]
    [Compare(nameof(Password), ErrorMessage = "Пароли не совпадают")]
    public string? PasswordConfirm { get; set; } = string.Empty;
}
