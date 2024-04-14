namespace DataApi.Models
{
    public class UserDal
    {
        public long Id { get; set; }

        public List<UserEventDal> UserEvents { get; set; } = new ();
    }
}
