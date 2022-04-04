using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Event
{
    public int EventId { get; set; }
    [StringLength(70)]
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int CreationTime { get; set; }
    public int StartTime { get; set; }
    public int EndTime { get; set; }
    [StringLength(70)]
    public string? CoverUrl { get; set; }

    public int TypeId { get; set; }
    public EventType Type { get; set; } = null!;

    public int CreatorId { get; set; }
    public User Creator { get; set; } = null!;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int? AddressId { get; set; }
    public Address? Address { get; set; }
}