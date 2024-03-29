using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace EventPlanner;

public class AuthOptions
{
    public const string ISSUER = "EventPlannerServer";
    public const string AUDIENCE = "EventPlannerClient";
    public const int LIFETIME = 10;
    private const string KEY = "testkey&0^iv!HgVs3*8H'k[IjiPJxIlWd&Q|uk-PQv57.yd0z1t'Me)";

    public static SymmetricSecurityKey GetSymmetricSecurityKey()
    {
        return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
    }
}
