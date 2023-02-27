using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Event : CommonModel<int>
{
    [StringLength(70)]
    public string Title { get; set; } = null!;
    [StringLength(250)]
    public string Description { get; set; } = null!;
    public string FullDescription { get; set; } = null!;
    public string? Cover { get; set; }

    public DateTime CreationTime { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public EventPlanner.EventType TypeId { get; set; }
    public EventType Type { get; set; } = null!;

    public int CreatorId { get; set; }
    public User Creator { get; set; } = null!;

    public int? AddressId { get; set; }
    public Address? Address { get; set; }
}
