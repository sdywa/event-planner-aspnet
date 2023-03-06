namespace EventPlanner.Controllers.Models;

public class ParticipationModel
{
    public List<AnswerModel> Answers { get; set; } = null!;
    public int TicketId { get; set; }
}
