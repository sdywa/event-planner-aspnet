using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Models.Events;

public class NewAddress 
{
    [Required(ErrorMessage = "Введите название страны")]
    [StringLength(70)]
    [MinLength(2, ErrorMessage = "Слишком короткое название")]
    public string Country { get; set; } = null!;
    [Required(ErrorMessage = "Введите название региона")]
    [StringLength(100)]
    [MinLength(2, ErrorMessage = "Слишком короткое название")]
    public string Region { get; set; } = null!;
    [Required(ErrorMessage = "Введите название города")]
    [StringLength(100)]
    [MinLength(2, ErrorMessage = "Слишком короткое название")]
    public string City { get; set; } = null!;
    [Required(ErrorMessage = "Введите улицу")]
    [StringLength(100)]
    [MinLength(2, ErrorMessage = "Слишком короткая улица")]
    public string Street { get; set; } = null!;
    [Required(ErrorMessage = "Введите здание")]
    [StringLength(5)]
    public string Building { get; set; } = null!;
    [Required(ErrorMessage = "Введите название места")]
    [StringLength(100)]
    [MinLength(2, ErrorMessage = "Слишком короткое название")]
    public String Title { get; set; } = null!;
}
