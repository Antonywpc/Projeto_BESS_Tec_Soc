using Microsoft.EntityFrameworkCore;
using BessApi.Data;
using BessApi.Models;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<BessContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();
app.UseCors("AllowReact");

// ── HEALTH CHECK ─────────────────────────────────────────
app.MapGet("/", () => "i9+ BESS API rodando!");

// ── LOOKUPS (para popular os selects do formulário) ──────

app.MapGet("/api/fabricantes", async (BessContext db) =>
    Results.Ok(await db.Fabricantes.OrderBy(f => f.Nome).ToListAsync()));

app.MapGet("/api/modelos", async (BessContext db) =>
    Results.Ok(await db.Modelos.OrderBy(m => m.Nome).ToListAsync()));

app.MapGet("/api/tecnologias", async (BessContext db) =>
    Results.Ok(await db.Tecnologias.OrderBy(t => t.Nome).ToListAsync()));

app.MapGet("/api/classificacoes", async (BessContext db) =>
    Results.Ok(await db.Classificacoes.OrderBy(c => c.Nome).ToListAsync()));

app.MapGet("/api/estados", async (BessContext db) =>
    Results.Ok(await db.Estados.OrderBy(e => e.Nome).ToListAsync()));

app.MapGet("/api/cidades/{idEstado:int}", async (int idEstado, BessContext db) =>
    Results.Ok(await db.Cidades
        .Where(c => c.IdEstado == idEstado)
        .OrderBy(c => c.Nome)
        .ToListAsync()));

// ── CADASTROS (listagem paginada com busca) ───────────────

app.MapGet("/api/cadastros", async (
    BessContext db,
    string? busca,
    int pagina = 1,
    int porPagina = 10) =>
{
    // Carrega lookups em dicionário (rápido)
    var fabricantes    = await db.Fabricantes.ToDictionaryAsync(f => f.Id, f => f.Nome);
    var modelos        = await db.Modelos.ToDictionaryAsync(m => m.Id, m => m.Nome);
    var tecnologias    = await db.Tecnologias.ToDictionaryAsync(t => t.Id, t => t.Nome);
    var classificacoes = await db.Classificacoes.ToDictionaryAsync(c => c.Id, c => c.Nome);
    var cidades        = await db.Cidades.ToDictionaryAsync(c => c.Id, c => c.Nome);
    var chassis        = await db.Chassis.ToDictionaryAsync(c => c.Id, c => c);

    // Query base — todos os registros
    var query = db.TipoModeloCidades.AsQueryable();

    // Filtro de busca por chassi ou fabricante (feito em memória após join leve)
    // Para chassi: filtra pelo número; para fabricante: filtra pelo nome via dicionário
    List<int>? idsFabricantesFiltrados = null;
    List<int>? idsChassisFiltrados = null;

    if (!string.IsNullOrWhiteSpace(busca))
    {
        var buscaLower = busca.ToLower();

        // IDs de fabricantes que batem com a busca
        idsFabricantesFiltrados = fabricantes
            .Where(kv => kv.Value != null && kv.Value.ToLower().Contains(buscaLower))
            .Select(kv => kv.Key)
            .ToList();

        // IDs de chassis que batem com a busca
        idsChassisFiltrados = chassis
            .Where(kv => kv.Value.NumeroChassi.ToLower().Contains(buscaLower))
            .Select(kv => kv.Key)
            .ToList();

        query = query.Where(r =>
            idsFabricantesFiltrados.Contains(r.IdFabricante) ||
            (r.IdChassi != null && idsChassisFiltrados.Contains(r.IdChassi.Value))
        );
    }

    var total = await query.CountAsync();

    var registros = await query
        .OrderByDescending(t => t.Id)
        .Skip((pagina - 1) * porPagina)
        .Take(porPagina)
        .ToListAsync();

    var resultado = registros.Select(r => new
    {
        r.Id,
        Fabricante    = fabricantes.GetValueOrDefault(r.IdFabricante, "—"),
        Modelo        = modelos.GetValueOrDefault(r.IdModelo, "—"),
        Tecnologia    = tecnologias.GetValueOrDefault(r.IdTecnologia, "—"),
        Classificacao = classificacoes.GetValueOrDefault(r.IdClassificacao, "—"),
        Cidade        = cidades.GetValueOrDefault(r.IdCidade, "—"),
        r.Quantidade,
        r.AnoInicial,
        r.AnoFinal,
        NumeroChassi = r.IdChassi != null && chassis.TryGetValue(r.IdChassi.Value, out var ch) ? ch.NumeroChassi : null,
    });

    return Results.Ok(new
    {
        total,
        pagina,
        porPagina,
        totalPaginas = (int)Math.Ceiling((double)total / porPagina),
        itens = resultado
    });
});

app.MapGet("/api/cadastros/{id:int}", async (int id, BessContext db) =>
{
    var r = await db.TipoModeloCidades.FindAsync(id);
    if (r is null) return Results.NotFound();

    var chassi   = r.IdChassi   != null ? await db.Chassis.FindAsync(r.IdChassi)     : null;
    var soh      = r.IdSoh      != null ? await db.Sohs.FindAsync(r.IdSoh)           : null;
    var quimica  = r.IdQuimica  != null ? await db.Quimicas.FindAsync(r.IdQuimica)   : null;
    var potencia = r.IdPotencia != null ? await db.Potencias.FindAsync(r.IdPotencia) : null;

    return Results.Ok(new
    {
        r.Id, r.IdModelo, r.IdFabricante, r.IdTecnologia,
        r.IdClassificacao, r.IdCidade, r.Quantidade, r.AnoInicial, r.AnoFinal,
        Chassi = chassi is null ? null : new {
            chassi.Id, chassi.NumeroChassi, chassi.ModeloVeiculo, chassi.AnoFabricacao
        },
        Soh = soh is null ? null : new {
            soh.Id, DataLeitura = soh.DataLeitura.ToString("yyyy-MM-dd"),
            soh.EstadoSaudeBateria, soh.Soc
        },
        Quimica = quimica is null ? null : new {
            quimica.Id, quimica.NomeComposto, quimica.FormulaQuimica, quimica.CasNumber
        },
        Potencia = potencia is null ? null : new {
            potencia.Id, potencia.PotenciaKw, potencia.TipoMotor
        }
    });
});

// ── CADASTRO — POST (cria nas 4 tabelas + vincula) ───────
app.MapPost("/api/cadastros", async (CadastroRequest req, BessContext db) =>
{
    // 1. Chassi
    var chassi = new Chassi
    {
        NumeroChassi  = req.NumeroChassi.ToUpper(),
        ModeloVeiculo = req.ModeloVeiculo,
        AnoFabricacao = req.AnoFabricacao,
    };
    db.Chassis.Add(chassi);

    // 2. SoH
    var soh = new Soh
    {
        DataLeitura          = DateOnly.Parse(req.DataLeitura),
        EstadoSaudeBateria   = req.EstadoSaudeBateria,
        Soc                  = req.Soc,
    };
    db.Sohs.Add(soh);

    // 3. Química
    var quimica = new Quimica
    {
        NomeComposto   = req.NomeComposto,
        FormulaQuimica = req.FormulaQuimica,
        CasNumber      = req.CasNumber,
    };
    db.Quimicas.Add(quimica);

    // 4. Potência
    var potencia = new Potencia
    {
        PotenciaKw = req.PotenciaKw,
        TipoMotor  = req.TipoMotor,
    };
    db.Potencias.Add(potencia);

    await db.SaveChangesAsync(); // gera os IDs

    // 5. Vincula tudo em tipo_modelo_cidade
    var tmc = new TipoModeloCidade
    {
        IdModelo        = req.IdModelo,
        IdFabricante    = req.IdFabricante,
        IdTecnologia    = req.IdTecnologia,
        IdClassificacao = req.IdClassificacao,
        IdCidade        = req.IdCidade,
        Quantidade      = req.Quantidade,
        AnoInicial      = req.AnoInicial,
        AnoFinal        = req.AnoFinal,
        IdChassi        = chassi.Id,
        IdSoh           = soh.Id,
        IdQuimica       = quimica.Id,
        IdPotencia      = potencia.Id,
    };
    db.TipoModeloCidades.Add(tmc);
    await db.SaveChangesAsync();

    return Results.Created($"/api/cadastros/{tmc.Id}", new { tmc.Id, chassi.NumeroChassi });
});

// ── CADASTRO — PUT (atualiza) ─────────────────────────────
app.MapPut("/api/cadastros/{id:int}", async (int id, CadastroRequest req, BessContext db) =>
{
    var tmc = await db.TipoModeloCidades.FindAsync(id);
    if (tmc is null) return Results.NotFound();

    // Atualiza Chassi
    if (tmc.IdChassi != null)
    {
        var chassi = await db.Chassis.FindAsync(tmc.IdChassi);
        if (chassi != null)
        {
            chassi.NumeroChassi  = req.NumeroChassi.ToUpper();
            chassi.ModeloVeiculo = req.ModeloVeiculo;
            chassi.AnoFabricacao = req.AnoFabricacao;
        }
    }

    // Atualiza SoH
    if (tmc.IdSoh != null)
    {
        var soh = await db.Sohs.FindAsync(tmc.IdSoh);
        if (soh != null)
        {
            soh.DataLeitura        = DateOnly.Parse(req.DataLeitura);
            soh.EstadoSaudeBateria = req.EstadoSaudeBateria;
            soh.Soc                = req.Soc;
        }
    }

    // Atualiza Química
    if (tmc.IdQuimica != null)
    {
        var quimica = await db.Quimicas.FindAsync(tmc.IdQuimica);
        if (quimica != null)
        {
            quimica.NomeComposto   = req.NomeComposto;
            quimica.FormulaQuimica = req.FormulaQuimica;
            quimica.CasNumber      = req.CasNumber;
        }
    }

    // Atualiza Potência
    if (tmc.IdPotencia != null)
    {
        var potencia = await db.Potencias.FindAsync(tmc.IdPotencia);
        if (potencia != null)
        {
            potencia.PotenciaKw = req.PotenciaKw;
            potencia.TipoMotor  = req.TipoMotor;
        }
    }

    // Atualiza vínculo
    tmc.IdModelo        = req.IdModelo;
    tmc.IdFabricante    = req.IdFabricante;
    tmc.IdTecnologia    = req.IdTecnologia;
    tmc.IdClassificacao = req.IdClassificacao;
    tmc.IdCidade        = req.IdCidade;
    tmc.Quantidade      = req.Quantidade;
    tmc.AnoInicial      = req.AnoInicial;
    tmc.AnoFinal        = req.AnoFinal;

    await db.SaveChangesAsync();
    return Results.Ok(new { tmc.Id });
});

// ── CADASTRO — DELETE ─────────────────────────────────────
app.MapDelete("/api/cadastros/{id:int}", async (int id, BessContext db) =>
{
    var tmc = await db.TipoModeloCidades.FindAsync(id);
    if (tmc is null) return Results.NotFound();

    // Desvincula primeiro, depois apaga os filhos
    int? idChassi = tmc.IdChassi, idSoh = tmc.IdSoh,
         idQuimica = tmc.IdQuimica, idPotencia = tmc.IdPotencia;

    tmc.IdChassi = tmc.IdSoh = tmc.IdQuimica = tmc.IdPotencia = null;
    await db.SaveChangesAsync();

    if (idChassi  != null) db.Chassis.Remove((await db.Chassis.FindAsync(idChassi))!);
    if (idSoh     != null) db.Sohs.Remove((await db.Sohs.FindAsync(idSoh))!);
    if (idQuimica != null) db.Quimicas.Remove((await db.Quimicas.FindAsync(idQuimica))!);
    if (idPotencia!= null) db.Potencias.Remove((await db.Potencias.FindAsync(idPotencia))!);

    db.TipoModeloCidades.Remove(tmc);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

// ── PRÓXIMO NÚMERO DE CHASSI (geração automática) ────────
app.MapGet("/api/cadastros/proximo-chassi", async (BessContext db) =>
{
    var total = await db.Chassis.CountAsync();
    var numero = $"I9{DateTime.Now.Year}{(total + 1):D5}";
    return Results.Ok(new { numero });
});

// ── DASHBOARD ─────────────────────────────────────────────

app.MapGet("/api/dashboard", async (BessContext db) =>
{
    // KPIs
    var totalRegistros   = await db.TipoModeloCidades.CountAsync();
    var totalFabricantes = await db.TipoModeloCidades.Select(t => t.IdFabricante).Distinct().CountAsync();
    var totalModelos     = await db.TipoModeloCidades.Select(t => t.IdModelo).Distinct().CountAsync();
    var totalCidades     = await db.TipoModeloCidades.Select(t => t.IdCidade).Distinct().CountAsync();
    var totalComChassi   = await db.TipoModeloCidades.CountAsync(t => t.IdChassi != null);

    // Por tecnologia
    var tecnologiasMap = await db.Tecnologias.ToDictionaryAsync(t => t.Id, t => t.Nome ?? "—");
    var porTecnologia = await db.TipoModeloCidades
        .GroupBy(t => t.IdTecnologia)
        .Select(g => new { IdTecnologia = g.Key, Quantidade = g.Sum(x => x.Quantidade ?? 1) })
        .OrderByDescending(g => g.Quantidade)
        .ToListAsync();
    var porTecnologiaResult = porTecnologia.Select(g => new {
        tecnologia = tecnologiasMap.GetValueOrDefault(g.IdTecnologia, "—"),
        quantidade = g.Quantidade
    });

    // Por classificação
    var classificacoesMap = await db.Classificacoes.ToDictionaryAsync(c => c.Id, c => c.Nome ?? "—");
    var porClassificacao = await db.TipoModeloCidades
        .GroupBy(t => t.IdClassificacao)
        .Select(g => new { IdClassificacao = g.Key, Quantidade = g.Sum(x => x.Quantidade ?? 1) })
        .OrderByDescending(g => g.Quantidade)
        .ToListAsync();
    var porClassificacaoResult = porClassificacao.Select(g => new {
        classificacao = classificacoesMap.GetValueOrDefault(g.IdClassificacao, "—"),
        quantidade = g.Quantidade
    });

    // Top 10 fabricantes
    var fabricantesMap = await db.Fabricantes.ToDictionaryAsync(f => f.Id, f => f.Nome ?? "—");
    var topFabricantes = await db.TipoModeloCidades
        .GroupBy(t => t.IdFabricante)
        .Select(g => new { IdFabricante = g.Key, Quantidade = g.Sum(x => x.Quantidade ?? 1) })
        .OrderByDescending(g => g.Quantidade)
        .Take(10)
        .ToListAsync();
    var topFabricantesResult = topFabricantes.Select(g => new {
        fabricante = fabricantesMap.GetValueOrDefault(g.IdFabricante, "—"),
        quantidade = g.Quantidade
    });

    // Top 10 modelos
    var modelosMap = await db.Modelos.ToDictionaryAsync(m => m.Id, m => m.Nome ?? "—");
    var topModelos = await db.TipoModeloCidades
        .GroupBy(t => t.IdModelo)
        .Select(g => new { IdModelo = g.Key, Quantidade = g.Sum(x => x.Quantidade ?? 1) })
        .OrderByDescending(g => g.Quantidade)
        .Take(10)
        .ToListAsync();
    var topModelosResult = topModelos.Select(g => new {
        modelo = modelosMap.GetValueOrDefault(g.IdModelo, "—"),
        quantidade = g.Quantidade
    });

    // Por ano
    var porAno = await db.TipoModeloCidades
        .Where(t => t.AnoInicial != null)
        .GroupBy(t => t.AnoInicial)
        .Select(g => new { Ano = g.Key, Quantidade = g.Sum(x => x.Quantidade ?? 1) })
        .OrderBy(g => g.Ano)
        .ToListAsync();
    var porAnoResult = porAno.Select(g => new { ano = g.Ano, quantidade = g.Quantidade });

    // Top 10 estados (cidade → estado → UF)
    var cidadesMap = await db.Cidades.ToDictionaryAsync(c => c.Id, c => c.IdEstado ?? 0);
    var estadosMap = await db.Estados.ToDictionaryAsync(e => e.Id, e => e.Uf ?? "—");

    var porEstado = await db.TipoModeloCidades
        .GroupBy(t => t.IdCidade)
        .Select(g => new { IdCidade = g.Key, Quantidade = g.Sum(x => x.Quantidade ?? 1) })
        .ToListAsync();

    var porEstadoAgrupado = porEstado
        .GroupBy(g => {
            var idEstado = cidadesMap.GetValueOrDefault(g.IdCidade, 0);
            return estadosMap.GetValueOrDefault(idEstado, "—");
        })
        .Select(g => new { estado = g.Key, quantidade = g.Sum(x => x.Quantidade) })
        .OrderByDescending(g => g.quantidade)
        .Take(10);

    return Results.Ok(new
    {
        kpis = new {
            totalRegistros,
            totalFabricantes,
            totalModelos,
            totalCidades,
            totalComChassi,
        },
        porTecnologia    = porTecnologiaResult,
        porClassificacao = porClassificacaoResult,
        topFabricantes   = topFabricantesResult,
        topModelos       = topModelosResult,
        porAno           = porAnoResult,
        topEstados       = porEstadoAgrupado,
    });
});

app.Run();