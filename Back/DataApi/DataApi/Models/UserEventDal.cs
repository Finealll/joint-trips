namespace DataApi.Models
{
    /// <summary>
    /// События, на которые идет пользователь.
    /// </summary>
    public class UserEventDal
    {
        public int EventId { get; set; }

        public EventDal? Event { get; set; }

        public long UserId { get; set; }

        public UserDal? User { get; set; }

        public bool IsPairFounded { get; set; }
    }
}
