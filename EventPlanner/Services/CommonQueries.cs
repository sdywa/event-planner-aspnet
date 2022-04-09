using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Models;

namespace EventPlanner.Services;

public class CommonQueries<T> where T : CommonModel
{
    private PlannerContext _context;

    public CommonQueries(PlannerContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(T entity, CancellationToken cancellationToken)
    {
        await _context.Set<T>().AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<T?> GetAsync(
        int id, 
        IQueryable<T> collection, 
        CancellationToken cancellationToken) => 
            await collection.FirstOrDefaultAsync(e => e.Id == id);

    public async Task<List<T>> GetAllAsync(
        IQueryable<T> collection,
        CancellationToken cancellationToken) =>
            await collection.ToListAsync();

    public async Task UpdateAsync(int id, T entity, CancellationToken cancellationToken)
    {
        entity.Id = id;
        _context.Set<T>().Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _context.Set<T>().FirstOrDefaultAsync((e) => e.Id == id);
        if (entity is null)
            throw new NullReferenceException();
        _context.Set<T>().Remove(entity);
        await _context.SaveChangesAsync();
    }
}