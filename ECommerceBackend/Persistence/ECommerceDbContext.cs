using ECommerceBackend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace ECommerceBackend.Persistence
{
    public class ECommerceDbContext : DbContext
    {
        public ECommerceDbContext(
            DbContextOptions<ECommerceDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Endereco> Enderecos { get; set; }

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

                entity.HasIndex(c => c.CPF).IsUnique();

                entity.HasIndex(c => c.Email).IsUnique();

                entity.HasIndex(c => new { c.DDD, c.Telefone }).IsUnique();
            });

            modelBuilder.Entity<Endereco>(entity =>
            {
                entity.HasKey(e => e.IdEndereco);

                entity.Property(e => e.Logradouro).IsRequired().HasMaxLength(150);

                entity.Property(e => e.Numero).IsRequired();

                entity.Property(e => e.Bairro).IsRequired().HasMaxLength(100);

                entity.Property(e => e.Complemento).HasMaxLength(150);

                entity.Property(e => e.Cep).IsRequired().HasMaxLength(8);

                entity.Property(e => e.Municipio).IsRequired().HasMaxLength(100);

                entity.Property(e => e.UF).IsRequired().HasMaxLength(2);

                entity.Property(e => e.IsEntrega).HasDefaultValue(false);

                entity.Property(e => e.IsCobranca).HasDefaultValue(false);

                entity.Property(e => e.IdCliente).IsRequired();

                entity.HasOne(e => e.Cliente)
                      .WithMany(c => c.Enderecos)
                      .HasForeignKey(e => e.IdCliente)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
