using Microsoft.EntityFrameworkCore;
using BessApi.Models;

namespace BessApi.Data;

public class BessContext : DbContext
{
    public BessContext(DbContextOptions<BessContext> options) : base(options) { }

    // Lookups (somente leitura)
    public DbSet<Fabricante>        Fabricantes        { get; set; }
    public DbSet<Modelo>            Modelos            { get; set; }
    public DbSet<Tecnologia>        Tecnologias        { get; set; }
    public DbSet<ClassificacaoVeiculo> Classificacoes  { get; set; }
    public DbSet<Regiao>            Regioes            { get; set; }
    public DbSet<Estado>            Estados            { get; set; }
    public DbSet<Cidade>            Cidades            { get; set; }

    // Tabelas do cadastro i9+
    public DbSet<Chassi>            Chassis            { get; set; }
    public DbSet<Soh>               Sohs               { get; set; }
    public DbSet<Quimica>           Quimicas           { get; set; }
    public DbSet<Potencia>          Potencias          { get; set; }
    public DbSet<TipoModeloCidade>  TipoModeloCidades  { get; set; }
}
