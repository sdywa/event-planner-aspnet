using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Message : CommonModel<int>
{
    public int ChatId { get; set; }
    public Chat Chat { get; set; } = null!;

    public int CreatorId { get; set; }
    public User Creator { get; set; } = null!;


    [StringLength(4500)]
    public string Text { get; set; } = null!;
}
