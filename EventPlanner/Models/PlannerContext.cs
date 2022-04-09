using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Models;

public class PlannerContext : DbContext 
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    
    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<EventType> EventTypes { get; set; } = null!;
    public DbSet<EventRating> EventRatings { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Address> Addresses { get; set; } = null!;

    public DbSet<Participant> Participants { get; set; } = null!;
    public DbSet<FavEvent> FavEvents { get; set; } = null!;

    public PlannerContext(DbContextOptions<PlannerContext> options) : base(options)
    {
        Database.EnsureCreated();
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<EventRating>().HasKey(t => new {
            t.EventId, t.UserId
        });
        builder.Entity<FavEvent>().HasKey(t => new {
            t.UserId, t.EventId
        });
        
        builder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Participant", Title = "Участник" },
            new Role { Id = 2, Name = "Organizer", Title = "Организатор" });

        builder.Entity<EventType>().HasData(
            new EventType { Id = 1, Name = "Offline" },
            new EventType { Id = 2, Name = "Online" });

        builder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Other", Title = "Другое" },
            new Category { Id = 2, Name = "IT", Title = "ИТ и интернет" });

        builder.Entity<User>().HasData(
            new User {
                Id = 1,
                FirstName = "Валентин",
                LastName = "Купцов",
                Email = "sima@pm.me",
                Password = "$2a$11$1TjBUPHK6tsKddKdXUp9KeFbC/u6NvYL4mzE6wqroeMvw.n0pgxWu",
                RegTime = 1649515526,
                AvatarUrl = null,
                RoleId = 1
            },
            new User {
                Id = 2,
                FirstName = "неВалентин",
                LastName = "Купцов",
                Email = "asya@me.pm",
                Password = "$2a$11$.wAt7jt37WlsLhmZH3J9eOijrox.elpjNJ5WXpnzdPYQUjkoiEGWe",
                RegTime = 1649515541,
                AvatarUrl = null,
                RoleId = 1
            }
        );

        builder.Entity<Address>().HasData(
            new Address {
                Id = 1,
                Country = "Россия",
                Region = "Краснодарский край",
                City = "Краснодар",
                Street = "Красных Партизан",
                Building = "10",
                Title = "VEGAS-GRAND"
            },
            new Address {
                Id = 2,
                Country = "Россия",
                Region = "Москва",
                City = "Москва",
                Street = "Красная площадь",
                Building = "9",
                Title = "В гостях у дядюшки Ленина"
            }
        );
    }
}