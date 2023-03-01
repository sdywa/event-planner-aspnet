using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Question : CommonModel<int>
{
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;
    [StringLength(45)]
    public string Title { get; set; } = null!;
    public Boolean IsEditable { get; set; }
}
