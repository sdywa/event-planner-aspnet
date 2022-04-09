using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class EventType : CommonModel
{
    [StringLength(45)]
    public string Name { get; set; } = null!;
}