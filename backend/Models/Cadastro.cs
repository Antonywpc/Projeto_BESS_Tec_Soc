using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BessApi.Models;

// ── Tabelas preenchidas pelo cadastro i9+ ────────────────

[Table("chassi")]
public class Chassi
{
    [Key][Column("id_chassi")] public int Id { get; set; }

    [Required][Column("numero_chassi")][StringLength(17)]
    public string NumeroChassi { get; set; } = "";

    [Required][Column("modelo_veiculo")][StringLength(100)]
    public string ModeloVeiculo { get; set; } = "";

    [Required][Column("ano_fabricacao")]
    public int AnoFabricacao { get; set; }
}

[Table("soh")]
public class Soh
{
    [Key][Column("id_soh")] public int Id { get; set; }

    [Required][Column("data_leitura")]
    public DateOnly DataLeitura { get; set; }

    [Required][Column("estado_saude_bateria")]
    [Range(0, 100)]
    public decimal EstadoSaudeBateria { get; set; }

    [Required][Column("soc")]
    [Range(0, 100)]
    public decimal Soc { get; set; }
}

[Table("quimica")]
public class Quimica
{
    [Key][Column("id_quimica")] public int Id { get; set; }

    [Required][Column("nome_composto")][StringLength(100)]
    public string NomeComposto { get; set; } = "";

    [Required][Column("formula_quimica")][StringLength(50)]
    public string FormulaQuimica { get; set; } = "";

    [Column("cas_number")][StringLength(20)]
    public string? CasNumber { get; set; }
}

[Table("potencia")]
public class Potencia
{
    [Key][Column("id_potencia")] public int Id { get; set; }

    [Required][Column("potencia_kw")]
    public decimal PotenciaKw { get; set; }

    [Required][Column("tipo_motor")][StringLength(50)]
    public string TipoMotor { get; set; } = "";
}

// ── Tabela central de vínculo ────────────────────────────

[Table("tipo_modelo_cidade")]
public class TipoModeloCidade
{
    [Key][Column("id_ctm")] public int Id { get; set; }

    [Column("id_modelo")]        public int IdModelo { get; set; }
    [Column("id_fabricante")]    public int IdFabricante { get; set; }
    [Column("id_tecnologia")]    public int IdTecnologia { get; set; }
    [Column("id_classificacao")] public int IdClassificacao { get; set; }
    [Column("id_cidade")]        public int IdCidade { get; set; }

    [Column("quantidade")]   public int? Quantidade { get; set; }
    [Column("ano_inicial")]  public int? AnoInicial { get; set; }
    [Column("ano_final")]    public int? AnoFinal { get; set; }

    // FKs para as tabelas i9+
    [Column("chassi")]   public int? IdChassi { get; set; }
    [Column("soh")]      public int? IdSoh { get; set; }
    [Column("quimica")]  public int? IdQuimica { get; set; }
    [Column("potencia")] public int? IdPotencia { get; set; }
}

// ── DTO de retorno do cadastro completo ──────────────────
// Agrega tudo numa resposta só para o frontend

public class CadastroRequest
{
    // Chassi
    public string NumeroChassi   { get; set; } = "";
    public string ModeloVeiculo  { get; set; } = "";
    public int    AnoFabricacao  { get; set; }

    // SoH
    public decimal EstadoSaudeBateria { get; set; }
    public decimal Soc                { get; set; }
    public string  DataLeitura        { get; set; } = "";

    // Química
    public string  NomeComposto   { get; set; } = "";
    public string  FormulaQuimica { get; set; } = "";
    public string? CasNumber      { get; set; }

    // Potência
    public decimal PotenciaKw { get; set; }
    public string  TipoMotor  { get; set; } = "";

    // Vínculo
    public int  IdModelo        { get; set; }
    public int  IdFabricante    { get; set; }
    public int  IdTecnologia    { get; set; }
    public int  IdClassificacao { get; set; }
    public int  IdCidade        { get; set; }
    public int? Quantidade      { get; set; }
    public int? AnoInicial      { get; set; }
    public int? AnoFinal        { get; set; }
}
