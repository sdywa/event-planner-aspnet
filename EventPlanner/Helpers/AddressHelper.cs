using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using EventPlanner.Models;

namespace EventPlanner.Helpers;

public static class AddressHelper
{
    public static string GetAddress(Address? address) =>
        $"{address?.Country}, г. {address?.City}, ул. {address?.Street}, {address?.Building}";
}   