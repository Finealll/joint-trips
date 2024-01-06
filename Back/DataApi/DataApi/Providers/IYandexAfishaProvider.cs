using System.ComponentModel.DataAnnotations;
using DataApi.Dto;
using Newtonsoft.Json.Linq;
using Refit;

namespace DataApi.Providers
{
    public interface IYandexAfishaProvider
    {
        [Get("/api/events/rubric/main?hasMixed=0&city=kaluga")]
        Task<string> GetAfishaItems(
            int? limit = null,
            int? offset = null
            );

        [Get("")]
        Task<string> GetItemPage(
            [Url] string url,
            [Header("User-Agent")] string userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    }
}

