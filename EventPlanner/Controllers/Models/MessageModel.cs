using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Controllers.Models;

public class MessageModel
{
    [MinLength(50, ErrorMessage = "Используйте не менее 50 символов")]
    [StringLength(4500, ErrorMessage = "Используйте менее 4500 символов")]
    public string Text { get; set; } = null!;
    public bool CloseChat { get; set; } = false;
}
