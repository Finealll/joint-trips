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

        public DbSet<UserEventDal> UserEvents { get; set; }

        protected override void OnModelCreating( ModelBuilder modelBuilder )
        {
            modelBuilder.Entity<UserEventDal>()
                .HasOne(x => x.User)
                .WithMany(e => e.UserEvents)
                .HasForeignKey(x => x.UserId)
                .IsRequired();
            modelBuilder.Entity<UserEventDal>()
                .HasOne(x => x.Event)
                .WithMany(e => e.EventUsers)
                .HasForeignKey(x => x.EventId)
                .IsRequired();
            modelBuilder.Entity<UserEventDal>()
                .HasKey(u => new { u.UserId, u.EventId });
        }
    }
}
