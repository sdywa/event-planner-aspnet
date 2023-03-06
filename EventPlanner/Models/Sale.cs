using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Sale : CommonModel<int>
{
    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime SaleDate { get; set; }

    public ICollection<Answer> Answers { get; set; } = null!;
}
