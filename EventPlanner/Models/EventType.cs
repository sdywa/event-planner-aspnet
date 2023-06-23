using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class EventType : CommonModel<EventPlanner.EventType>
{
    [StringLength(45)]
    public string Name { get; set; } = null!;

    [StringLength(45)]
    public string Title { get; set; } = null!;
}
