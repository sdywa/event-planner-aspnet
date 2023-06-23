using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Answer : CommonModel<int>
{
    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;

    [StringLength(70)]
    public string Text { get; set; } = null!;
}
