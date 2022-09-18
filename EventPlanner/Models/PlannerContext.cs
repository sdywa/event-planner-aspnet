using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Models;

public class PlannerContext : DbContext 
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    
    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<EventType> EventTypes { get; set; } = null!;
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

        builder.Entity<FavEvent>().HasKey(t => new {
            t.UserId, t.EventId
        });

        builder.Entity<EventType>().HasData(
            new EventType{ Id = 1, Name = "Offline", Title = "Офлайн" },
            new EventType{ Id = 2, Name = "Online", Title = "Онлайн" }
        );
        builder.Entity<Category>().HasData(
            new Category{ Id = 1, Name = "Business", Title = "Бизнес" },
            new Category{ Id = 2, Name = "IT", Title = "ИТ и интернет" },
            new Category{ Id = 3, Name = "Science", Title = "Наука" },
            new Category{ Id = 4, Name = "Hobby", Title = "Хобби и творчество" },
            new Category{ Id = 5, Name = "Languages", Title = "Иностранные языки" },
            new Category{ Id = 6, Name = "Culture", Title = "Искусство и культура" },
            new Category{ Id = 7, Name = "Movie", Title = "Кино" },
            new Category{ Id = 8, Name = "Sport", Title = "Спорт" },
            new Category{ Id = 9, Name = "Exhibition", Title = "Выставки" },
            new Category{ Id = 10, Name = "Concert", Title = "Концентры" },
            new Category{ Id = 11, Name = "Other", Title = "Другие события" },
            new Category{ Id = 12, Name = "OtherEntertaiment", Title = "Другие развлечения" }
        );
        builder.Entity<Role>().HasData(
            new Role{ Id = 1, Name = "Participant", Title = "Участник" },
            new Role{ Id = 2, Name = "Organizer", Title = "Организатор" }
        );
    }
}