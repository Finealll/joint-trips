using DataApi.Models;

namespace DataApi.Services.YandexAfisha
{
    public interface IYandexAfishaService
    {
        public Task<List<EventDal>> GetRealData();
    }
}
