using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Controllers.Models;

public class AnswerModel
{
    public int QuestionId { get; set; }
    [Required(ErrorMessage = "Укажите название билета")]
    [StringLength(70, ErrorMessage = "Используйте менее 70 символов")]
    public string Text { get; set; } = null!;
}