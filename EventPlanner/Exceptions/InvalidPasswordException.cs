namespace EventPlanner.Exceptions;

public class InvalidPasswordException : Exception
{
    public string? Email { get; set; }
    public string? Password { get; set; }

    public InvalidPasswordException(string email, string password)
    {
        Email = email;
        Password = password;
    }
}