using System.Linq;
using EventPlanner.Models;
using EventPlanner.Services.EventOrganizationServices;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.UserServices;

namespace EventPlanner.Services.AdvertisingServices;

public class AdvertisingService : IAdvertisingService
{
    private static CriteriaValues CriteriaWeights = new CriteriaValues
    {
        DaysFromLastSale = -.1,
        SalesCount = .75,
        MinPrice = -.5,
        MaxPrice = -.2,
        FavEventCount = .3,
        CreatorRating = 5
    };

    private Context _context;
    private IEventOrganizationService _eventOrganizationService;
    private IEventStorageService _eventStorageService;
    private IUserService _userService;

    public AdvertisingService(
        Context context,
        IEventOrganizationService eventOrganizationService,
        IEventStorageService eventStorageService,
        IUserService userService)
    {
        _context = context;
        _eventOrganizationService = eventOrganizationService;
        _eventStorageService = eventStorageService;
        _userService = userService;
    }

    private List<(int, double)> NormalizeAndSum(
        Dictionary<int, CriteriaValues> criteriaValues,
        CriteriaValues maxCriteriaValues)
    {
        var type = typeof(CriteriaValues);
        var normalized = new List<(int, double)>();
        foreach (var e in criteriaValues)
        {
            var sum = 0d;
            foreach (var pi in type.GetProperties())
            {
                var value = (double?)type.GetProperty(pi.Name)?.GetValue(e.Value, null);
                var maxValue = (double?)type.GetProperty(pi.Name)?.GetValue(maxCriteriaValues, null);
                var result = value / maxValue;
                if (result != null)
                    sum += (double)result;
            }
            normalized.Add((e.Key, sum));
        }
        return normalized;
    }

    private async Task<List<(int, double)>> Calculate(List<Event> events, CriteriaValues? customValues = null)
    {
        var criteriaValues = new Dictionary<int, CriteriaValues>();
        var maxCriteriaValues = new CriteriaValues();
        var type = typeof(CriteriaValues);

        // Подсчёт значений
        foreach (var e in events)
        {
            criteriaValues[e.Id] = await GetCriteriaValues(e);
            foreach (var pi in type.GetProperties())
            {
                var value = (double?)type.GetProperty(pi.Name)?.GetValue(criteriaValues[e.Id], null);
                var currentValue = (double?)type.GetProperty(pi.Name)?.GetValue(maxCriteriaValues, null);
                // Ищем максимальное значение
                if (value > currentValue)
                    type.GetProperty(pi.Name)?.SetValue(maxCriteriaValues, value);

                var multiplier = (double?)type.GetProperty(pi.Name)?.GetValue(CriteriaWeights, null);
                var customMultiplier = (double?)type.GetProperty(pi.Name)?.GetValue(customValues, null);
                if (multiplier != null)
                    type.GetProperty(pi.Name)?.SetValue(criteriaValues[e.Id], value * GetWeight((double)multiplier, customMultiplier));
            }
        }

        return NormalizeAndSum(criteriaValues, maxCriteriaValues);
    }

    private double GetWeight(double original, double? custom)
    {
        if (custom != null && custom != 0)
            return (double)custom;
        return original;
    }

    private async Task<CriteriaValues> GetCriteriaValues(Event e)
    {
        var sales = await _eventOrganizationService.GetAllByEventAsync(e.Id);
        var minPrice = e.Tickets.Min(t => t.Price);
        var maxPrice = e.Tickets.Max(t => t.Price);
        var favEventCount = _context.FavEvents.Where(f => f.EventId == e.Id).Count();
        var salesCount = sales.Count;
        var creatorRating = await _eventOrganizationService.GetAverageRatingAsync(e.CreatorId);
        var daysFromLastSale = 0;
        if (sales.Count != 0)
            daysFromLastSale = (DateTime.Now - sales.OrderByDescending(s => s.SaleDate).First().SaleDate).Days;

        return new CriteriaValues
        {
            DaysFromLastSale = daysFromLastSale,
            SalesCount = salesCount,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            FavEventCount = favEventCount,
            CreatorRating = creatorRating
        };
    }

    private double GetMinPriceMultiplier(int averagePrice)
    {
        if (averagePrice < 0)
            return CriteriaWeights.MinPrice;
        else if (averagePrice > 1000)
            return -.1;
        return 0.0004 * averagePrice - 0.5;
    }

    private double GetMaxPriceMultiplier(int averagePrice)
    {
        if (averagePrice < 0)
            return CriteriaWeights.MaxPrice;
        else if (averagePrice > 1000)
            return -.02;
        return 0.00018 * averagePrice - 0.2;
    }

    public async Task<List<Event>> GetAdvertising(int? userId, List<Event> fromEvents, int limit)
    {
        var averagePrice = 0;
        if (userId != null)
        {
            var user = await _userService.GetAsync((int)userId);
            var sales = user?.Sales.Select(s => s.Ticket.Price);
            if (sales != null && sales.Count() != 0)
                averagePrice = (int)sales.Average();
        }

        var minPriceMultiplier = GetMinPriceMultiplier(averagePrice);
        var maxPriceMultiplier = GetMaxPriceMultiplier(averagePrice);
        var results = await Calculate(fromEvents, new CriteriaValues
        {
            MinPrice = minPriceMultiplier,
            MaxPrice = maxPriceMultiplier
        });
        var sortedResults = results.OrderByDescending(r => r.Item2).Take(limit);
        var resultEvents = new List<Event>();
        foreach (var result in sortedResults)
        {
            var e = await _eventStorageService.GetAsync(result.Item1);
            if (e != null)
                resultEvents.Add(e);
        }

        return resultEvents;
    }
}
