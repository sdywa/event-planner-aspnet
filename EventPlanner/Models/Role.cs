using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Role
{
    public UserRole Id { get; set; }
    [StringLength(45)]
    public string Name { get; set; } = null!;
    [StringLength(45)]
    public string Title { get; set; } = null!;
}