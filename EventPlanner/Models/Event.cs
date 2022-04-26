using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Event : CommonModel
{
    [StringLength(70)]
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public long CreationTime { get; set; }
    public long StartTime { get; set; }
    public long EndTime { get; set; }
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

    public ICollection<Participant> Participants { get; set; } = null!;
}