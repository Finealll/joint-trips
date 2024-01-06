using DataApi.Models;
using DataApi.Providers;
using DataApi.Services.YandexAfisha;

namespace DataApi.Hosted
{
    public class EventsDataUpdaterHostedService: BackgroundService
    {
        private readonly ApplicationDbContext _db;
        private readonly IYandexAfishaService _yandexAfishaService;
        private readonly ILogger<EventsDataUpdaterHostedService> _logger;

        public EventsDataUpdaterHostedService(
            IServiceScopeFactory factory,
            IYandexAfishaService yandexAfishaService,
            ILogger<EventsDataUpdaterHostedService> logger
            )
        {
            _db = factory.CreateScope().ServiceProvider.GetRequiredService<ApplicationDbContext>();
            _yandexAfishaService = yandexAfishaService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync( CancellationToken stoppingToken )
        {
            while (true)
            {
                var realEvents = await _yandexAfishaService.GetRealData();

                var newEvents = realEvents
                    .Where(e => _db.Events.Count(x => x.ExtraId == e.ExtraId) == 0)
                    .ToList();

                await _db.Events.AddRangeAsync(newEvents, stoppingToken);
                await _db.SaveChangesAsync(stoppingToken);
                _logger.LogInformation($"Успешно добавлено {newEvents.Count()} событий.");

                DateTimeOffset dayAfter = DateTimeOffset.Now.Date.AddDays(1);

                Thread.Sleep(dayAfter - DateTimeOffset.Now);
            }
        }
    }
}
