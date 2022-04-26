using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models.Events;

public class NewEvent 
{
    [Required(ErrorMessage = "Введите название мероприятия")]
    [StringLength(70)]
    [MinLength(4, ErrorMessage = "Слишком короткое название")]
    public string Name { get; set; } = null!;
    [Required(ErrorMessage = "Введите описание")]
    public string Description { get; set; } = null!;
    public IFormFile? Cover { get; set; }
    [Required(ErrorMessage = "Выберите тип")]
    public int TypeId { get; set; } = 1;
    [Required(ErrorMessage = "Выберите категорию")]
    public int CategoryId { get; set; } = 1;
}