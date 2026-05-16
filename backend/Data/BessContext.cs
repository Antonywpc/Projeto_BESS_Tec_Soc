using Microsoft.EntityFrameworkCore;
using BessApi.Models;

namespace BessApi.Data;

public class BessContext : DbContext
{
    public BessContext(DbContextOptions<BessContext> options) : base(options) { }

    public DbSet<Bateria> Baterias { get; set; }
}
