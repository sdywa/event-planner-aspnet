using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Models;

public class Context : DbContext
{
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<EventType> EventTypes { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Address> Addresses { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;
    public DbSet<Ticket> Tickets { get; set; } = null!;

    public DbSet<Answer> Answers { get; set; } = null!;
    public DbSet<Sale> Sales { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;

    public DbSet<FavEvent> FavEvents { get; set; } = null!;

    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<ChatStatus> ChatStatuses { get; set; } = null!;
    public DbSet<Chat> Chats { get; set; } = null!;

    public Context(DbContextOptions<Context> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<EventType>().HasData(
            new EventType { Id = EventPlanner.EventType.Offline, Name = "Offline", Title = "Офлайн" },
            new EventType { Id = EventPlanner.EventType.Online, Name = "Online", Title = "Онлайн" }
        );

        builder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Business", Title = "Бизнес" },
            new Category { Id = 2, Name = "IT", Title = "ИТ и интернет" },
            new Category { Id = 3, Name = "Science", Title = "Наука" },
            new Category { Id = 4, Name = "Hobby", Title = "Хобби и творчество" },
            new Category { Id = 5, Name = "Languages", Title = "Иностранные языки" },
            new Category { Id = 6, Name = "Culture", Title = "Искусство и культура" },
            new Category { Id = 7, Name = "Movie", Title = "Кино" },
            new Category { Id = 8, Name = "Sport", Title = "Спорт" },
            new Category { Id = 9, Name = "Exhibition", Title = "Выставки" },
            new Category { Id = 10, Name = "Concert", Title = "Концерты" },
            new Category { Id = 11, Name = "Other", Title = "Другие события" },
            new Category { Id = 12, Name = "OtherEntertaiment", Title = "Другие развлечения" }
        );

        builder.Entity<Role>().HasData(
            new Role { Id = UserRole.Participant, Name = "Participant", Title = "Участник" },
            new Role { Id = UserRole.Organizer, Name = "Organizer", Title = "Организатор" }
        );

        builder.Entity<ChatStatus>().HasData(
            new ChatStatus { Id = EventPlanner.ChatStatus.Active, Name = "Active" },
            new ChatStatus { Id = EventPlanner.ChatStatus.Waiting, Name = "Waiting" },
            new ChatStatus { Id = EventPlanner.ChatStatus.Closed, Name = "Closed" }
        );
    }
}
