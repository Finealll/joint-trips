namespace DataApi.Models
{
    public class UserDal
    {
        public long Id { get; set; }

        public List<EventDal> Events { get; set; } = new ();
    }
}
