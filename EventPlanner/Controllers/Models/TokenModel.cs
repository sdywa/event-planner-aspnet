using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Controllers.Models;

public class TokenModel
{
    [Required]
    public string Token { get; set; } = string.Empty;
}
