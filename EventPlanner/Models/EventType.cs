using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class EventType
{
    public int TypeId { get; set; }

    [StringLength(45)]
    public string? Name { get; set; }
}