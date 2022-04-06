using System.Globalization;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using EventPlanner.Models;

namespace EventPlanner.Helpers;

public static class TimeHelper
{
    public static string GetTime(DateTime dateTime) => dateTime.ToString("HH:mm");

    public static string GetTime(long unixTime) => 
        UnixTimeToDateTime(unixTime).ToString("HH:mm");

    private static DateTime UnixTimeToDateTime(long unixtime)
    {
        var dateTime = new DateTime(1970, 1, 1);
        dateTime = dateTime.AddSeconds(unixtime);
        return dateTime;
    }
}