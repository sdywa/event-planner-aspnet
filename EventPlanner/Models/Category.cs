using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Category : CommonModel<int>
{
    [StringLength(45)]
    public string Name { get; set; } = null!;
    [StringLength(45)]
    public string Title { get; set; } = null!;
}
