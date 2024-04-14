namespace DataApi.Models
{
    /// <summary>
    /// Модель событие.
    /// </summary>
    public class EventDal
    {
        /// <summary>
        /// Id события.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Id события во внешней системе.
        /// </summary>
        public string ExtraId { get; set; }

        public string Url { get; set; }

        public string Title { get; set; }

        public string PlaceName { get; set; }

        public string Address { get; set; }

        public string ContentRating { get; set; }

        public string? Description { get; set; }

        public DateTime Date { get; set; }

        public string TypeName { get; set; }

        public string ImageLink { get; set; }

        public List<UserEventDal> EventUsers { get; set; } = new ();
    }
}
