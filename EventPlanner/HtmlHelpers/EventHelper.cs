using System.Text;
using System.Globalization;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using EventPlanner.Models;
using EventPlanner.Helpers;

namespace EventPlanner.HtmlHelpers;

public static class EventHelper
{
    public static HtmlString CreateTiles(this IHtmlHelper html, IUrlHelper url, List<Event> events)
    {
        var culture = new CultureInfo("ru-RU");
        var builder = new StringBuilder();
        builder.Append("<div class=\"tiles\">");
        foreach (var currentEvent in events)
        {
            builder.Append($@"<a class=""tile"" href=""{url.Page("/Events/Event", new { currentEvent.Id })}"">
                <div class=""tile-cover"">
                    <img class=""tile-cover-blur"" src=""{currentEvent.CoverUrl}"" alt=""Обложка"">
                    <img src=""{currentEvent.CoverUrl}"" alt=""Обложка"">
                </div>
                <div class=""tile-desc"">
                    <div class=""tile-date"">");
            builder.Append(DateHelper.GetDate(currentEvent.StartTime, culture));
            builder.Append($@"</div>
                    <div class=""tile-title"">{currentEvent.Name}</div>
                    
                    <div class=""tile-address"">");
            if (currentEvent.Type.Name == "Offline")
            {
                builder.Append(AddressHelper.GetAddress(currentEvent.Address));
            }
            else
            {
                builder.Append("<text>Мероприятие пройдёт онлайн</text>");
            }
            builder.Append(@$"
                    </div>
                    <div class=""tags-box tile-tags"">
                        <div class=""tag"">{currentEvent.Category.Title}</div>
                    </div>
                </div>
            </a>");
        }
        return new HtmlString(builder.ToString());
    }
}