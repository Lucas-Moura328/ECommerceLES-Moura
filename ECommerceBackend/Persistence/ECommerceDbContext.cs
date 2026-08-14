using ECommerceBackend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace ECommerceBackend.Persistence
{
    public class ECommerceDbContext : DbContext
    {
        public ECommerceDbContext(
            DbContextOptions<ECommerceDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>()
                .HasKey(c => c.IdCliente);

            base.OnModelCreating(modelBuilder);
        }
    }
}
