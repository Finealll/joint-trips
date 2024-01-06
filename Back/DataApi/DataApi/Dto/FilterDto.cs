namespace DataApi.Dto
{
    public class FilterDto
    {
        public DateTime? EventDate { get; set; }

        public int Limit { get; set; } = 10;

        public int Offset { get; set; } = 0;
    }
}
