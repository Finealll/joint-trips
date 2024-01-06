using DataApi.Dto;
using DataApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataApi.Controllers;

[ApiController]
[Route("api/data")]
public class DataController: ControllerBase
{
    private readonly ApplicationDbContext _db;

    public DataController(
            ApplicationDbContext db
        )
    {
        _db = db;
    }

    [HttpPost("filter")]
    public async Task<List<EventDal>> Filter(FilterDto filterDto)
    {
        var query = _db.Events.AsQueryable();

        if (filterDto.EventDate.HasValue)
        {
            query = query.Where(x => x.Date.ToUniversalTime().Date == filterDto.EventDate.Value.ToUniversalTime().Date);
        }

        query = query
            .OrderBy(x => x.Date)
            .Skip(filterDto.Offset)
            .Take(filterDto.Limit);

        var data = await query.ToListAsync();

        return data;
    }

    [HttpPost("user/add")]
    public async Task AddUser(AddUserDto addUserDto)
    {
        if (!_db.Users.Any(x => x.Id == addUserDto.UserId))
        {
            await _db.AddAsync(new UserDal() { Id = addUserDto.UserId });
            await _db.SaveChangesAsync();
        }
    }

    [HttpPost("user/assign")]
    public async Task AssignUserToEvent(AssignDto assignDto)
    {
        var ev = await _db.Events
            .Include(x => x.Users)
            .FirstAsync(x => x.Id == assignDto.EventId);
        var user = await _db.Users.FirstAsync(x => x.Id == assignDto.UserId);

        if (ev.Users.All(x => x.Id != user.Id))
        {
            ev.Users.Add(user);
            _db.Update(ev);
            await _db.SaveChangesAsync();
        }
    }

    [HttpPost("user/unassign")]
    public async Task UnassignUserToEvent(AssignDto assignDto)
    {
        var ev = await _db.Events
            .Include(x => x.Users)
            .FirstAsync(x => x.Id == assignDto.EventId);
        var user = ev.Users.FirstOrDefault(x => x.Id == assignDto.UserId);

        if (user != default)
        {
            ev.Users.Remove(user);
        }

        _db.Update(ev);
        await _db.SaveChangesAsync();
    }
}
