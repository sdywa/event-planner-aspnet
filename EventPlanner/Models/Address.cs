using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Address : CommonModel<int>
{
    [StringLength(40)]
    public string Country { get; set; } = null!;
    [StringLength(100)]
    public string Region { get; set; } = null!;
    [StringLength(100)]
    public string City { get; set; } = null!;
    [StringLength(100)]
    public string Street { get; set; } = null!;
    [StringLength(5)]
    public string Building { get; set; } = null!;
}