using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using EventPlanner;
using EventPlanner.Models;
using EventPlanner.Services.UserServices;
using EventPlanner.Services.AdvertisingServices;
using EventPlanner.Services.AuthenticationServices;
using EventPlanner.Services.AuthorizationService;
using EventPlanner.Services.EventStorageServices;
using EventPlanner.Services.EventOrganizationServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<Context>(options => options
    .UseMySql(connection, ServerVersion.AutoDetect(connection)));

builder.Services.AddControllers()
.AddNewtonsoftJson(options => {
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "test", policy => {
        policy.WithOrigins("http://localhost:3000");
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.AllowCredentials();
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.RequireHttpsMetadata = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = AuthOptions.ISSUER,

            ValidateAudience = true,
            ValidAudience = AuthOptions.AUDIENCE,
            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IAuthenticationService, AuthenticationService>();
builder.Services.AddTransient<IAuthorizationService, AuthorizationService>();

builder.Services.AddTransient<IEventStorageService, EventStorageService>();
builder.Services.AddTransient<IEventOrganizationService, EventOrganizationService>();
builder.Services.AddTransient<IAdvertisingService, AdvertisingService>();


var app = builder.Build();

// Create DB if not exist.
using(var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<Context>();
    var isCreated = await context.Database.EnsureCreatedAsync();
    if (isCreated) {
        context.Sales
            .Include(s => s.Ticket)
            .Include(s => s.User)
            .ToList()
            .ForEach(s =>
                context.Questions
                    .Where(q => q.EventId == s.Ticket.EventId)
                    .ToList()
                    .ForEach(q => {
                        var text = "";
                        if (q.Title == "Email")
                            text = s.User.Email;
                        else if (q.Title == "Ваше Имя")
                            text = s.User.Name;
                        else if (q.Title == "Ваша Фамилия")
                            text = s.User.Surname;

                        context.Answers.Add(
                            new Answer {
                                QuestionId = q.Id,
                                SaleId = s.Id,
                                Text = text
                            }
                        );
                    }));
        await context.SaveChangesAsync();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("test");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
