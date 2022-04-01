using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventPlanner.Models;

public class EventRating
{
    [Key, Column(Order=0)]
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;

    [Key, Column(Order=1)]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int Rating { get; set; }
    [StringLength(45)]
    public string Comment { get; set; } = null!;
}