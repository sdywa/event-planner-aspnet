using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Models;

public class Context : DbContext
{
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

    public Context(DbContextOptions<Context> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Role>().HasData(
            new Role { Id = UserRole.Participant, Name = "Participant", Title = "Участник" },
            new Role { Id = UserRole.Organizer, Name = "Organizer", Title = "Организатор" },
            new Role { Id = UserRole.Administrator, Name = "Administrator", Title = "Администратор" }
        );
    }
}
