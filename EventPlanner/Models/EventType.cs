using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class EventType
{
    [Key]
    public int TypeId { get; set; }

    [StringLength(45)]
    public string Name { get; set; } = null!;
    [StringLength(45)]
    public string Title { get; set; } = null!;
}