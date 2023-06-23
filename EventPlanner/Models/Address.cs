using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models;

public class Address : CommonModel<int>
{
    public float Latitude { get; set; }
    public float Longitude { get; set; }

    [StringLength(256)]
    public string Full { get; set; } = null!;

    [StringLength(40)]
    public string Region { get; set; } = null!;

    [StringLength(100)]
    public string City { get; set; } = null!;

    [StringLength(100)]
    public string Street { get; set; } = null!;

    [StringLength(5)]
    public string House { get; set; } = null!;

    [StringLength(5)]
    public string? Block { get; set; }
}
