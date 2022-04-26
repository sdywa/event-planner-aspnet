using System.Globalization;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using EventPlanner.Models;

namespace EventPlanner.Helpers;

public static class DateHelper
{
    public static string GetDate(DateTime datetime, CultureInfo culture) => 
        datetime.ToString("dd MMMM yyyy 'г.'", culture);
    
    public static string GetDate(long unixTime, CultureInfo culture) => 
        UnixTimeToDateTime(unixTime).ToString("dd MMMM yyyy 'г.'", culture);

    public static string GetDayName(DateTime dateTime, CultureInfo culture) => 
        culture.DateTimeFormat.GetDayName(dateTime.DayOfWeek);

    public static string GetDayName(long unixTime, CultureInfo culture) => 
        culture.DateTimeFormat.GetDayName(UnixTimeToDateTime(unixTime).DayOfWeek);

    public static DateTime UnixTimeToDateTime(long unixTime)
    {
        var dateTime = new DateTime(1970, 1, 1);
        dateTime = dateTime.AddSeconds(unixTime);
        return dateTime;
    }

    public static long DateTimeToUnixTime(DateTime datetime) =>
        ((DateTimeOffset) datetime).ToUnixTimeSeconds();
}