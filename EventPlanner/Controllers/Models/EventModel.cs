using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Controllers.Models;

public class EventModel
{
    [Required(ErrorMessage = "Укажите название")]
    [StringLength(70, ErrorMessage = "Используйте менее 70 символов")]
    [MinLength(3, ErrorMessage = "Используйте не менее 3 символов")]
    public string Title { get; set; } = null!;
    [Required(ErrorMessage = "Укажите краткое описание")]
    [StringLength(250, ErrorMessage = "Используйте менее 250 символов")]
    [MinLength(50, ErrorMessage = "Используйте не менее 50 символов")]
    public string Description { get; set; } = null!;
    [Required(ErrorMessage = "Укажите подробное описание")]
    [MinLength(200, ErrorMessage = "Используйте не менее 200 символов")]
    public string FullDescription { get; set; } = null!;
    public IFormFile? Cover { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    [Required(ErrorMessage = "Выберите тип")]
    public EventType Type { get; set; }
    [Required(ErrorMessage = "Выберите категорию")]
    public int Category { get; set; }
    public string? Address { get; set; }
}
