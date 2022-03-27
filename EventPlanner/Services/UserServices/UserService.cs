using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services.UserServices;

public class UserService : IUserService
{
    private PlannerContext _context;

    public UserService(PlannerContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(User entity, CancellationToken cancellationToken)
    {
        await _context.Users.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == id);
        return entity;
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var entity = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email);
        return entity;
    }

    public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken)
    {
        var entities = await _context.Users
            .Include(u => u.Role)
            .ToListAsync();
        return entities;
    }

    public async Task UpdateAsync(int id, User entity, CancellationToken cancellationToken)
    {
        entity.UserId = id;
        _context.Users.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _context.Users.FirstOrDefaultAsync((e) => e.UserId == id);
        if (entity is null)
            throw new NullReferenceException();
        _context.Users.Remove(entity);
        await _context.SaveChangesAsync();
    }
}