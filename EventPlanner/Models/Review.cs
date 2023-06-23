namespace EventPlanner.Models;

public class Review : CommonModel<int>
{
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public int Rating { get; set; }
}
