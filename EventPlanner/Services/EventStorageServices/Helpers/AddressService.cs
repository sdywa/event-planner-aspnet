using EventPlanner.Models;

namespace EventPlanner.Services.EventStorageServices;

public class AddressService : CommonQueries<int, Address>
{
    private Context _context;

    public AddressService(Context context)
        : base(context)
    {
        _context = context;
    }

    public async Task<Address?> GetAsync(int id) => await base.GetAsync(id, _context.Addresses);
}
