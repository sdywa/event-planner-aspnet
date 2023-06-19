using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Controllers.Models;

public class QuestionModel
{
    public List<Question> Questions { get; set; } = null!;

    public class Question
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Укажите текст вопроса")]
        [StringLength(70, ErrorMessage = "Используйте менее 70 символов")]
        [MinLength(5, ErrorMessage = "Используйте не менее 5 символов")]
        public string Title { get; set; } = null!;
        public Boolean IsEditable { get; set; }
    }
}
