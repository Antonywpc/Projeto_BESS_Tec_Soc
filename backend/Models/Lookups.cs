using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BessApi.Models;

// ── Tabelas de lookup (somente leitura) ──────────────────

[Table("fabricante")]
public class Fabricante
{
    [Key][Column("id_fabricante")] public int Id { get; set; }
    [Column("fabricante")] public string Nome { get; set; } = "";
}

[Table("modelo")]
public class Modelo
{
    [Key][Column("id_modelo")] public int Id { get; set; }
    [Column("modelo")] public string? Nome { get; set; }
}

[Table("tecnologia")]
public class Tecnologia
{
    [Key][Column("id_tecnologia")] public int Id { get; set; }
    [Column("tecnologia")] public string? Nome { get; set; }
}

[Table("classificacao_veiculo")]
public class ClassificacaoVeiculo
{
    [Key][Column("id_classificacao")] public int Id { get; set; }
    [Column("classificacao")] public string? Nome { get; set; }
}

[Table("regiao")]
public class Regiao
{
    [Key][Column("id_regiao")] public int Id { get; set; }
    [Column("regiao")] public string? Nome { get; set; }
}

[Table("estado")]
public class Estado
{
    [Key][Column("id_estado")] public int Id { get; set; }
    [Column("uf")] public string? Uf { get; set; }
    [Column("estado")] public string? Nome { get; set; }
    [Column("id_regiao")] public int IdRegiao { get; set; }
}

[Table("cidade")]
public class Cidade
{
    [Key][Column("id_cidade")] public int Id { get; set; }
    [Column("cidade")] public string? Nome { get; set; }
    [Column("id_estado")] public int? IdEstado { get; set; }
}
