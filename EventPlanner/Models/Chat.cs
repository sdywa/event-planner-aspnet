using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Chat : CommonModel<int>
{
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;

    public int InitiatorId { get; set; }
    public User Initiator { get; set; } = null!;

    public EventPlanner.ChatStatus StatusId { get; set; }
    public ChatStatus Status { get; set; } = null!;

    [StringLength(150)]
    public string Theme { get; set; } = null!;
    public DateTime CreationTime { get; set; } = DateTime.Now;

    public ICollection<Message> Messages { get; set; } = null!;
}
