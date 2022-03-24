using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Category
{
    public int CategoryId { get; set; }

    [StringLength(45)]
    public string? Name { get; set; }
}