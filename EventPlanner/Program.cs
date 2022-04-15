using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using EventPlanner.Models;
using EventPlanner.Services.UserServices;
using EventPlanner.Services.AuthenticationServices;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages().AddRazorRuntimeCompilation();

var connection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<PlannerContext>(options => options
    .UseMySql(connection, ServerVersion.AutoDetect(connection)));
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<EventPlanner.Services.AuthenticationServices.IAuthenticationService,
    EventPlanner.Services.AuthenticationServices.AuthenticationService>();
builder.Services.AddTransient<IEventStorageService, EventStorageService>();
builder.Services.AddTransient<IEventOrganizationService, EventOrganizationService>();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => options.LoginPath = "/auth/login");
builder.Services.AddAuthorization();

builder.Services.Configure<RouteOptions>(option =>
    {
        option.LowercaseUrls = true;
        option.LowercaseQueryStrings = true;
    });

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();

app.Run();
