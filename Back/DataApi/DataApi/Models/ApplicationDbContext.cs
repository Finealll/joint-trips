using Microsoft.EntityFrameworkCore;

namespace DataApi.Models
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<EventDal> Events { get; set; }

        public DbSet<UserDal> Users { get; set; }

        protected override void OnModelCreating( ModelBuilder modelBuilder )
        {
            modelBuilder.Entity<EventDal>()
                .HasMany(e => e.Users)
                .WithMany(e => e.Events);
        }
    }
}
