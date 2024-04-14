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
    public async Task<List<EventDal>> FilterAsync(FilterDto filterDto)
    {
        var query = _db.Events.AsQueryable();

        if (filterDto.EventDate.HasValue)
        {
            query = query.Where(x => x.Date == filterDto.EventDate.Value.Date);
        }
        else
        {
            query = query.Where(x => x.Date.ToUniversalTime() > DateTime.UtcNow.Date);
        }

        query = query
            .OrderBy(x => x.Date)
            .Skip(filterDto.Offset)
            .Take(filterDto.Limit);

        var data = await query.ToListAsync();

        return data;
    }

    [HttpPost("user/add")]
    public async Task AddUserAsync(AddUserDto addUserDto)
    {
        if (!_db.Users.Any(x => x.Id == addUserDto.UserId))
        {
            await _db.AddAsync(new UserDal() { Id = addUserDto.UserId });
            await _db.SaveChangesAsync();
        }
    }

    [HttpPost("user/assign")]
    public async Task AssignUserToEventAsync(AssignDto assignDto)
    {
        var ev = await _db.Events
            .AsNoTracking()
            .Include(x => x.EventUsers)
            .FirstAsync(x => x.Id == assignDto.EventId);
        var user = await _db.Users.FirstAsync(x => x.Id == assignDto.UserId);

        var userEvent = ev.EventUsers.FirstOrDefault(x => x.UserId == user.Id);
        if (userEvent == default)
        {
            await _db.AddAsync(new UserEventDal()
            {
                UserId = user.Id,
                EventId = ev.Id
            });
            await _db.SaveChangesAsync();
        }
    }

    [HttpPost("user/unassign")]
    public async Task UnassignUserToEventAsync(AssignDto assignDto)
    {
        var ev = await _db.Events
            .AsNoTracking()
            .Include(x => x.EventUsers)
            .FirstAsync(x => x.Id == assignDto.EventId);
        var userEvent = ev.EventUsers.FirstOrDefault(x => x.UserId == assignDto.UserId);

        if (userEvent != default)
        {
            _db.Remove(userEvent);
            await _db.SaveChangesAsync();
        }
    }

    [HttpGet("event/assignedUsers")]
    public async Task<List<UserDto>> GetEventUsersAsync(long eventId)
    {
        var ev = await _db.Events
            .AsNoTracking()
            .Include(x => x.EventUsers)
            .FirstAsync(x => x.Id == eventId);

        return ev.EventUsers
            .Where(x => !x.IsPairFounded)
            .Select(user => new UserDto() { Id = user.UserId })
            .ToList();
    }

    [HttpPost("user/foundPair")]
    public async Task UserFoundPairAsync(FoundPairDto foundPairDto)
    {
        var userEvent = await _db.UserEvents
            .FirstOrDefaultAsync(x => x.UserId == foundPairDto.UserId && x.EventId == foundPairDto.EventId);

        if (userEvent != default)
        {
            userEvent.IsPairFounded = true;
            _db.Update(userEvent);
            await _db.SaveChangesAsync();
        }
    }

    [HttpPost("user/unFoundPair")]
    public async Task UserUnFoundPairAsync(FoundPairDto foundPairDto)
    {
        var userEvent = await _db.UserEvents
            .FirstOrDefaultAsync(x => x.UserId == foundPairDto.UserId && x.EventId == foundPairDto.EventId);

        if (userEvent != default)
        {
            userEvent.IsPairFounded = false;
            _db.Update(userEvent);
            await _db.SaveChangesAsync();
        }
    }

    [HttpGet("event/metrics")]
    public async Task<UserEventMetricsDto> GetEventMetrics(int eventId, long userId)
    {
        var ev = await _db.Events
            .AsNoTracking()
            .Include(x => x.EventUsers)
            .FirstAsync(x => x.Id == eventId);

        var userEvent = ev.EventUsers.FirstOrDefault(x => x.UserId == userId);

        return new UserEventMetricsDto()
        {
            UsersCount = ev.EventUsers.Count,
            IsUserGoing = userEvent != default,
            IsUserFoundPair = userEvent?.IsPairFounded ?? false
        };
    }
}
