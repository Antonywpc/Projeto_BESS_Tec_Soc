import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getFabricantes, getModelos, getTecnologias,
  getClassificacoes, getEstados, getCidades,
  proximoNumeroChassi, criarCadastro, atualizarCadastro, buscarCadastro
} from '../api'

const QUIMICAS = [
  { nome: 'LFP — Lítio Ferro Fosfato',        formula: 'LiFePO4',   cas: '15365-14-7' },
  { nome: 'NMC — Níquel Manganês Cobalto',     formula: 'LiNiMnCoO2', cas: '182442-95-1' },
  { nome: 'NCA — Níquel Cobalto Alumínio',     formula: 'LiNiCoAlO2', cas: '193214-24-3' },
  { nome: 'LCO — Lítio Cobalto',               formula: 'LiCoO2',    cas: '12190-79-3' },
  { nome: 'LTO — Lítio Titanato',              formula: 'Li4Ti5O12',  cas: '12031-38-8' },
  { nome: 'Outro',                              formula: '',           cas: '' },
]

const VAZIO = {
  // Chassi
  numeroChassi: '',
  modeloVeiculo: '',
  anoFabricacao: new Date().getFullYear(),
  // SoH
  estadoSaudeBateria: '',
  soc: '',
  dataLeitura: new Date().toISOString().split('T')[0],
  // Química
  nomeComposto: '',
  formulaQuimica: '',
  casNumber: '',
  // Potência
  potenciaKw: '',
  tipoMotor: '',
  // Vínculo
  idModelo: '',
  idFabricante: '',
  idTecnologia: '',
  idClassificacao: '',
  idEstado: '',
  idCidade: '',
  quantidade: '',
  anoInicial: '',
  anoFinal: '',
}

export default function Cadastro() {
  const { id }      = useParams()
  const modoEdicao  = Boolean(id)
  const navigate    = useNavigate()

  const [form, setForm]         = useState(VAZIO)
  const [loading, setLoading]   = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [sucesso, setSucesso]   = useState(false)
  const [erro, setErro]         = useState(null)

  // Lookups
  const [fabricantes,    setFabricantes]    = useState([])
  const [modelos,        setModelos]        = useState([])
  const [tecnologias,    setTecnologias]    = useState([])
  const [classificacoes, setClassificacoes] = useState([])
  const [estados,        setEstados]        = useState([])
  const [cidades,        setCidades]        = useState([])

  // ── Carrega lookups + dado inicial ──────────────────────
  useEffect(() => {
    async function init() {
      try {
        const [fabs, mods, tecs, cls, ests] = await Promise.all([
          getFabricantes(), getModelos(), getTecnologias(),
          getClassificacoes(), getEstados(),
        ])
        setFabricantes(fabs)
        setModelos(mods)
        setTecnologias(tecs)
        setClassificacoes(cls)
        setEstados(ests)

        if (modoEdicao) {
          const d = await buscarCadastro(id)
          // Descobre o estado a partir da cidade
          const cidade = ests.flatMap(() => []).find(c => c.id === d.idCidade)
          setForm({
            numeroChassi:       d.chassi?.numeroChassi   ?? '',
            modeloVeiculo:      d.chassi?.modeloVeiculo  ?? '',
            anoFabricacao:      d.chassi?.anoFabricacao  ?? new Date().getFullYear(),
            estadoSaudeBateria: String(d.soh?.estadoSaudeBateria ?? ''),
            soc:                String(d.soh?.soc ?? ''),
            dataLeitura:        d.soh?.dataLeitura ?? new Date().toISOString().split('T')[0],
            nomeComposto:       d.quimica?.nomeComposto   ?? '',
            formulaQuimica:     d.quimica?.formulaQuimica ?? '',
            casNumber:          d.quimica?.casNumber      ?? '',
            potenciaKw:         String(d.potencia?.potenciaKw ?? ''),
            tipoMotor:          d.potencia?.tipoMotor     ?? '',
            idModelo:           String(d.idModelo        ?? ''),
            idFabricante:       String(d.idFabricante    ?? ''),
            idTecnologia:       String(d.idTecnologia    ?? ''),
            idClassificacao:    String(d.idClassificacao ?? ''),
            idEstado:           '',
            idCidade:           String(d.idCidade        ?? ''),
            quantidade:         String(d.quantidade      ?? ''),
            anoInicial:         String(d.anoInicial      ?? ''),
            anoFinal:           String(d.anoFinal        ?? ''),
          })
        } else {
          // Preenche número de chassi automático
          const numero = await proximoNumeroChassi()
          setForm(f => ({ ...f, numeroChassi: numero }))
        }
      } catch (e) {
        setErro('Erro ao carregar dados: ' + e.message)
      } finally {
        setCarregando(false)
      }
    }
    init()
  }, [id, modoEdicao])

  // ── Carrega cidades quando muda o estado ────────────────
  useEffect(() => {
    if (!form.idEstado) { setCidades([]); return }
    getCidades(form.idEstado).then(setCidades).catch(() => setCidades([]))
  }, [form.idEstado])

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setSucesso(false)
    setErro(null)
  }

  // Atalho: selecionar química pré-definida preenche formula e CAS
  function handleQuimica(e) {
    const nome = e.target.value
    const q = QUIMICAS.find(q => q.nome === nome)
    setForm(f => ({
      ...f,
      nomeComposto:   nome,
      formulaQuimica: q?.formula ?? '',
      casNumber:      q?.cas     ?? '',
    }))
  }

  async function enviar(e) {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    setSucesso(false)
    try {
      const payload = {
        numeroChassi:       form.numeroChassi.toUpperCase(),
        modeloVeiculo:      form.modeloVeiculo,
        anoFabricacao:      parseInt(form.anoFabricacao),
        estadoSaudeBateria: parseFloat(form.estadoSaudeBateria),
        soc:                parseFloat(form.soc),
        dataLeitura:        form.dataLeitura,
        nomeComposto:       form.nomeComposto,
        formulaQuimica:     form.formulaQuimica,
        casNumber:          form.casNumber || null,
        potenciaKw:         parseFloat(form.potenciaKw),
        tipoMotor:          form.tipoMotor,
        idModelo:           parseInt(form.idModelo),
        idFabricante:       parseInt(form.idFabricante),
        idTecnologia:       parseInt(form.idTecnologia),
        idClassificacao:    parseInt(form.idClassificacao),
        idCidade:           parseInt(form.idCidade),
        quantidade:         form.quantidade ? parseInt(form.quantidade) : null,
        anoInicial:         form.anoInicial ? parseInt(form.anoInicial) : null,
        anoFinal:           form.anoFinal   ? parseInt(form.anoFinal)   : null,
      }
      if (modoEdicao) {
        await atualizarCadastro(id, payload)
      } else {
        await criarCadastro(payload)
      }
      setSucesso(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (carregando) {
    return <div className="empty-state" style={{ marginTop: '4rem' }}><div className="icon">⏳</div>Carregando...</div>
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{modoEdicao ? '✏ Editar Registro' : 'Cadastrar Bateria'}</div>
          <div className="page-sub">
            {modoEdicao ? `Editando chassi: ${form.numeroChassi}` : 'Preencha os dados da bateria de segunda vida'}
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>← Voltar</button>
      </div>

      {sucesso && <div className="alert alert-success">✓ Registro {modoEdicao ? 'atualizado' : 'cadastrado'} com sucesso! Redirecionando...</div>}
      {erro    && <div className="alert alert-error">⚠ {erro}</div>}

      <div className="card">
        <form onSubmit={enviar}>
          <div className="form-grid">

            {/* ── Chassi ── */}
            <div className="section-label">🚗 Chassi</div>

            <div className="form-group">
              <label>
                Número do Chassi *
                {!modoEdicao && (
                  <button type="button" onClick={async () => {
                    const n = await proximoNumeroChassi()
                    setForm(f => ({ ...f, numeroChassi: n }))
                  }} style={{ marginLeft: 8, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'underline', padding: 0 }}>
                    ↺ gerar novo
                  </button>
                )}
              </label>
              <input name="numeroChassi" value={form.numeroChassi} onChange={handle}
                placeholder="Ex: I9202600001" required style={{ fontFamily: 'var(--mono)' }} />
              {!modoEdicao && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gerado automaticamente — editável</span>}
            </div>

            <div className="form-group">
              <label>Modelo do Veículo de Origem *</label>
              <select name="modeloVeiculo" value={form.modeloVeiculo} onChange={handle} required>
                <option value="">Selecione o modelo...</option>
                {modelos.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Ano de Fabricação *</label>
              <input type="number" name="anoFabricacao" value={form.anoFabricacao}
                onChange={handle} min="2000" max={new Date().getFullYear()} required />
            </div>

            {/* ── SoH ── */}
            <div className="section-label">⚡ Estado de Saúde da Bateria</div>

            <div className="form-group">
              <label>SoH % — State of Health *</label>
              <input type="number" name="estadoSaudeBateria" value={form.estadoSaudeBateria}
                onChange={handle} min="0" max="100" step="0.01" placeholder="Ex: 78.50" required />
            </div>

            <div className="form-group">
              <label>SoC % — State of Charge *</label>
              <input type="number" name="soc" value={form.soc}
                onChange={handle} min="0" max="100" step="0.01" placeholder="Ex: 95.00" required />
            </div>

            <div className="form-group">
              <label>Data da Leitura *</label>
              <input type="date" name="dataLeitura" value={form.dataLeitura} onChange={handle} required />
            </div>

            {/* ── Química ── */}
            <div className="section-label">🧪 Química da Célula</div>

            <div className="form-group">
              <label>Tipo de Química *</label>
              <select name="nomeComposto" value={form.nomeComposto} onChange={handleQuimica} required>
                <option value="">Selecione...</option>
                {QUIMICAS.map(q => <option key={q.nome} value={q.nome}>{q.nome}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Fórmula Química *</label>
              <input name="formulaQuimica" value={form.formulaQuimica} onChange={handle}
                placeholder="Ex: LiFePO4" required style={{ fontFamily: 'var(--mono)' }} />
            </div>

            <div className="form-group">
              <label>CAS Number</label>
              <input name="casNumber" value={form.casNumber} onChange={handle}
                placeholder="Ex: 15365-14-7" style={{ fontFamily: 'var(--mono)' }} />
            </div>

            {/* ── Potência ── */}
            <div className="section-label">🔌 Potência</div>

            <div className="form-group">
              <label>Potência (kW) *</label>
              <input type="number" name="potenciaKw" value={form.potenciaKw}
                onChange={handle} min="0" step="0.01" placeholder="Ex: 150.00" required />
            </div>

            <div className="form-group">
              <label>Tipo de Motor *</label>
              <select name="tipoMotor" value={form.tipoMotor} onChange={handle} required>
                <option value="">Selecione...</option>
                {tecnologias.map(t => <option key={t.id} value={t.nome}>{t.nome}</option>)}
              </select>
            </div>

            {/* ── Vínculo ── */}
            <div className="section-label">🔗 Identificação do Veículo</div>

            <div className="form-group">
              <label>Fabricante *</label>
              <select name="idFabricante" value={form.idFabricante} onChange={handle} required>
                <option value="">Selecione...</option>
                {fabricantes.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Modelo *</label>
              <select name="idModelo" value={form.idModelo} onChange={handle} required>
                <option value="">Selecione...</option>
                {modelos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Tecnologia *</label>
              <select name="idTecnologia" value={form.idTecnologia} onChange={handle} required>
                <option value="">Selecione...</option>
                {tecnologias.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Classificação *</label>
              <select name="idClassificacao" value={form.idClassificacao} onChange={handle} required>
                <option value="">Selecione...</option>
                {classificacoes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Estado *</label>
              <select name="idEstado" value={form.idEstado} onChange={handle} required>
                <option value="">Selecione o estado...</option>
                {estados.map(e => <option key={e.id} value={e.id}>{e.uf} — {e.nome}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Cidade *</label>
              <select name="idCidade" value={form.idCidade} onChange={handle}
                required disabled={!form.idEstado}>
                <option value="">{form.idEstado ? 'Selecione a cidade...' : 'Selecione o estado primeiro'}</option>
                {cidades.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Ano Inicial</label>
              <input type="number" name="anoInicial" value={form.anoInicial}
                onChange={handle} min="2000" max={new Date().getFullYear()} placeholder="Ex: 2020" />
            </div>

            <div className="form-group">
              <label>Ano Final</label>
              <input type="number" name="anoFinal" value={form.anoFinal}
                onChange={handle} min="2000" max={new Date().getFullYear() + 10} placeholder="Ex: 2025" />
            </div>

            <div className="form-group">
              <label>Quantidade</label>
              <input type="number" name="quantidade" value={form.quantidade}
                onChange={handle} min="1" placeholder="Ex: 1" />
            </div>

          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Salvando...' : modoEdicao ? '✓ Salvar Alterações' : '✓ Cadastrar Bateria'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
