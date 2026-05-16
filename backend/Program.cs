using Microsoft.EntityFrameworkCore;
using BessApi.Data;
using BessApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Conexão com MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<BessContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// CORS — libera o frontend React na porta 5173
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors("AllowReact");

// ── ENDPOINTS ──────────────────────────────────────────────

// GET /api/baterias/proximo-codigo — gera o próximo código único no padrão I9-AAAA-NNN
app.MapGet("/api/baterias/proximo-codigo", async (BessContext db) =>
{
    var ano = DateTime.Now.Year;
    var prefixo = $"I9-{ano}-";

    // Busca todos os códigos deste ano e pega o maior número sequencial
    var codigos = await db.Baterias
        .Where(b => b.CodigoUnico.StartsWith(prefixo))
        .Select(b => b.CodigoUnico)
        .ToListAsync();

    int proximoNum = 1;
    if (codigos.Any())
    {
        var numeros = codigos
            .Select(c => c.Replace(prefixo, ""))
            .Where(s => int.TryParse(s, out _))
            .Select(s => int.Parse(s));

        if (numeros.Any())
            proximoNum = numeros.Max() + 1;
    }

    var codigo = $"{prefixo}{proximoNum:D3}";
    return Results.Ok(new { codigo });
});

// GET /api/baterias — lista todas as baterias
app.MapGet("/api/baterias", async (BessContext db) =>
{
    var baterias = await db.Baterias
        .OrderByDescending(b => b.CriadoEm)
        .ToListAsync();
    return Results.Ok(baterias);
});

// GET /api/baterias/{id} — busca uma bateria pelo ID
app.MapGet("/api/baterias/{id:int}", async (int id, BessContext db) =>
{
    var bateria = await db.Baterias.FindAsync(id);
    return bateria is null ? Results.NotFound() : Results.Ok(bateria);
});

// POST /api/baterias — cadastra nova bateria
app.MapPost("/api/baterias", async (Bateria bateria, BessContext db) =>
{
    // Verifica código duplicado
    var existe = await db.Baterias.AnyAsync(b => b.CodigoUnico == bateria.CodigoUnico);
    if (existe)
        return Results.Conflict(new { error = $"Código '{bateria.CodigoUnico}' já cadastrado." });

    bateria.CriadoEm = DateTime.Now;
    bateria.AtualizadoEm = DateTime.Now;

    db.Baterias.Add(bateria);
    await db.SaveChangesAsync();
    return Results.Created($"/api/baterias/{bateria.Id}", bateria);
});

// PUT /api/baterias/{id} — atualiza uma bateria
app.MapPut("/api/baterias/{id:int}", async (int id, Bateria atualizada, BessContext db) =>
{
    var bateria = await db.Baterias.FindAsync(id);
    if (bateria is null) return Results.NotFound();

    bateria.Fabricante       = atualizada.Fabricante;
    bateria.Modelo           = atualizada.Modelo;
    bateria.Quimica          = atualizada.Quimica;
    bateria.DataFabricacao   = atualizada.DataFabricacao;
    bateria.SohPercentual    = atualizada.SohPercentual;
    bateria.CapacidadeOriginal = atualizada.CapacidadeOriginal;
    bateria.CiclosAnteriores = atualizada.CiclosAnteriores;
    bateria.Status           = atualizada.Status;
    bateria.DataEntrada      = atualizada.DataEntrada;
    bateria.Localizacao      = atualizada.Localizacao;
    bateria.Origem           = atualizada.Origem;
    bateria.MotivoSaida      = atualizada.MotivoSaida;
    bateria.DestinoFinal     = atualizada.DestinoFinal;
    bateria.AtualizadoEm     = DateTime.Now;

    await db.SaveChangesAsync();
    return Results.Ok(bateria);
});

// DELETE /api/baterias/{id} — remove uma bateria
app.MapDelete("/api/baterias/{id:int}", async (int id, BessContext db) =>
{
    var bateria = await db.Baterias.FindAsync(id);
    if (bateria is null) return Results.NotFound();

    db.Baterias.Remove(bateria);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Health check
app.MapGet("/", () => "i9+ BESS API rodando!");

app.Run();
