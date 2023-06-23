using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Controllers.Models;

public class ChatModel
{
    [MinLength(10, ErrorMessage = "Используйте не менее 10 символов")]
    [StringLength(150, ErrorMessage = "Используйте менее 150 символов")]
    public string Theme { get; set; } = null!;

    [MinLength(50, ErrorMessage = "Используйте не менее 50 символов")]
    [StringLength(4500, ErrorMessage = "Используйте менее 4500 символов")]
    public string Text { get; set; } = null!;
}
