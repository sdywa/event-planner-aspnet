using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class User : CommonModel<int>
{
    [StringLength(30)]
    public string Name { get; set; } = null!;
    [StringLength(45)]
    public string Surname { get; set; } = null!;
    [StringLength(50)]
    public string Email { get; set; } = null!;
    [StringLength(70)]
    public string Password { get; set; } = null!;
    public long RegTime { get; set; }

    public UserRole RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public string? RefreshTokenId { get; set; }
    public RefreshToken? RefreshToken { get; set; }

    public ICollection<FavEvent> FavEvents { get; set; } = null!;
    public ICollection<Event> CreatedEvents { get; set; } = null!;
}
