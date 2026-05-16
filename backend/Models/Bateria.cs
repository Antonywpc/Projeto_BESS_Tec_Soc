using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BessApi.Models;

[Table("baterias")]
public class Bateria
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    // Identificação
    [Required]
    [Column("codigo_unico")]
    [StringLength(50)]
    public string CodigoUnico { get; set; } = "";

    [Required]
    [Column("fabricante")]
    [StringLength(100)]
    public string Fabricante { get; set; } = "";

    [Required]
    [Column("modelo")]
    [StringLength(100)]
    public string Modelo { get; set; } = "";

    [Required]
    [Column("quimica")]
    [StringLength(10)]
    public string Quimica { get; set; } = "";

    [Required]
    [Column("data_fabricacao")]
    public DateOnly DataFabricacao { get; set; }

    // Estado Técnico
    [Required]
    [Column("soh_percentual")]
    [Range(0, 100)]
    public decimal SohPercentual { get; set; }

    [Required]
    [Column("capacidade_original")]
    public decimal CapacidadeOriginal { get; set; }

    [Column("ciclos_anteriores")]
    public int CiclosAnteriores { get; set; }

    // Rastreabilidade
    [Required]
    [Column("status")]
    [StringLength(30)]
    public string Status { get; set; } = "Em estoque";

    [Required]
    [Column("data_entrada")]
    public DateOnly DataEntrada { get; set; }

    [Required]
    [Column("localizacao")]
    [StringLength(200)]
    public string Localizacao { get; set; } = "";

    [Required]
    [Column("origem")]
    [StringLength(200)]
    public string Origem { get; set; } = "";

    // ESG
    [Column("motivo_saida")]
    [StringLength(300)]
    public string? MotivoSaida { get; set; }

    [Column("destino_final")]
    [StringLength(200)]
    public string? DestinoFinal { get; set; }

    // Metadados
    [Column("criado_em")]
    public DateTime CriadoEm { get; set; }

    [Column("atualizado_em")]
    public DateTime AtualizadoEm { get; set; }
}
