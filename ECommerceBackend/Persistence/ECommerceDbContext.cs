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
            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.HasKey(c => c.IdCliente);

                entity.Property(c => c.Nome).IsRequired().HasMaxLength(150);

                entity.Property(c => c.CPF).IsRequired().HasMaxLength(11);

                entity.Property(c => c.DataNascimento).IsRequired();

                entity.Property(c => c.Senha).IsRequired().HasMaxLength(255);

                entity.Property(c => c.Email).IsRequired().HasMaxLength(150);

                entity.Property(c => c.DDD).IsRequired().HasMaxLength(2);

                entity.Property(c => c.Telefone).IsRequired().HasMaxLength(9);

                entity.Property(c => c.Ativo).HasDefaultValue(true);

                entity.Property(c => c.IsAdmin).HasDefaultValue(false);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
