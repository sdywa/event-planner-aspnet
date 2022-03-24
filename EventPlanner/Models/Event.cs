using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Event
{
    public int EventId { get; set; }
    [StringLength(70)]
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int CreationTime { get; set; }
    public int StartTime { get; set; }
    public int EndTime { get; set; }
    [StringLength(70)]
    public string? CoverUrl { get; set; }

    public int TypeId { get; set; }
    public Type? Type { get; set; }

    public int CreatorId { get; set; }
    public User? Creator { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}