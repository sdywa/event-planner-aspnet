using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class User : CommonModel<int>
{
    [StringLength(30)]
    public string FirstName { get; set; } = null!;
    [StringLength(45)]
    public string LastName { get; set; } = null!;
    [StringLength(50)]
    public string Email { get; set; } = null!;
    [StringLength(70)]
    public string Password { get; set; } = null!;
    public long RegTime { get; set; }

    public UserRole RoleId { get; set; }
    public Role Role { get; set; } = null!;

}