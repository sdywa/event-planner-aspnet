using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class FavEvent
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;
}