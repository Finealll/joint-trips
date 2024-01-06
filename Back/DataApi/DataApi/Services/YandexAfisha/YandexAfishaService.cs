using DataApi.Models;
using DataApi.Providers;
using Fizzler.Systems.HtmlAgilityPack;
using HtmlAgilityPack;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DataApi.Services.YandexAfisha
{
    public class YandexAfishaService: IYandexAfishaService
    {
        private readonly IYandexAfishaProvider _yandexAfishaProvider;
        private readonly ILogger<YandexAfishaService> _logger;

        public YandexAfishaService(
            IYandexAfishaProvider yandexAfishaProvider,
            ILogger<YandexAfishaService> logger )
        {
            _yandexAfishaProvider = yandexAfishaProvider;
            _logger = logger;
        }

        public async Task<List<EventDal>> GetRealData()
        {
            var data = new List<EventDal>();

#if DEBUG

            data.AddRange(JsonConvert.DeserializeObject<List<EventDal>>( await File.ReadAllTextAsync("/Users/aleksejaleksandrov/Desktop/Diploma N/joint-trips/Back/DataApi/DataApi/data.json")));

#else
            var itemsPart = JObject.Parse(await _yandexAfishaProvider.GetAfishaItems());
            
            var total = itemsPart["paging"]["total"].Value<int>();
            var limit = itemsPart["paging"]["limit"].Value<int>();
            
            for (int i = 0; i < total; i += limit)
            {
                _logger.LogInformation($"[GetRealData] Обработка {i}-{i + limit} / {total}");
            
                itemsPart = JObject.Parse(await _yandexAfishaProvider.GetAfishaItems(limit, i));
            
                foreach (var item in itemsPart["data"])
                {
                    try
                    {
                        var page = await _yandexAfishaProvider.GetItemPage(item["event"]["url"].Value<string>());
                        var html = new HtmlDocument();
                        html.LoadHtml(page);
            
                        data.Add(new EventDal()
                        {
                            ExtraId = item["event"]["id"].Value<string>(),
                            Url = item["event"]["url"].Value<string>(),
                            Title = item["event"]["title"].Value<string>(),
                            ContentRating = item["event"]["contentRating"].Value<string?>(),
                            TypeName = item["event"]["type"]["name"].Value<string?>(),
                            ImageLink = item["event"]["image"]["sizes"]["featured"]["url"].Value<string>(),
                            PlaceName = item["scheduleInfo"]["oneOfPlaces"]["title"].Value<string>(),
                            Date = item["scheduleInfo"]["dateStarted"].Value<DateTime>(),
                            Address = item["scheduleInfo"]["oneOfPlaces"]["address"].Value<string>(),
                            Description = html.DocumentNode.QuerySelectorAll(".concert-description__text-wrap").FirstOrDefault()?.InnerText
                        });
                    }
                    catch (Exception _)
                    {
                    }
                }
            }
#endif

            return data;
        }
    }
}
