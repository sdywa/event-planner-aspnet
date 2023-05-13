using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Controllers.Models;

public class TicketModel
{
    public List<Ticket> Tickets { get; set; } = null!;

    public class Ticket
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Укажите название билета")]
        [StringLength(50, ErrorMessage = "Используйте менее 50 символов")]
        [MinLength(5, ErrorMessage = "Используйте не менее 5 символов")]
        public string Title { get; set; } = null!;
        [Required(ErrorMessage = "Укажите лимит")]
        public int Limit { get; set; }
        [Required(ErrorMessage = "Укажите цену")]
        public int Price { get; set; }
        public DateTime Until { get; set; }
    }
}
