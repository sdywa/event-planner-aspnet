namespace EventPlanner.Models;

public class RefreshToken : CommonModel<String>
{
    public DateTime Created { get; set; } = DateTime.Now;
    public DateTime Expires { get; set; }
}
