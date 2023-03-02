using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Ticket : CommonModel<int>
{
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;
    [StringLength(50)]
    public string Title { get; set; } = null!;
    public int Limit { get; set; }
    public int Price { get; set; }
    public DateTime Until { get; set; }
}
