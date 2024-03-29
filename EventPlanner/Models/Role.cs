using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Role : CommonModel<UserRole>
{
    [StringLength(45)]
    public string Name { get; set; } = null!;

    [StringLength(45)]
    public string Title { get; set; } = null!;
}
