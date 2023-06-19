using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class ChatStatus : CommonModel<EventPlanner.ChatStatus>
{
    [StringLength(15)]
    public string Name { get; set; } = null!;
}
