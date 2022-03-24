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

    public DbSet<Participant> Participants { get; set; } = null!;
    public DbSet<FavEvent> FavEvents { get; set; } = null!;

    public PlannerContext(DbContextOptions<PlannerContext> options) : base(options)
    {
        Database.EnsureCreated();
    }
}