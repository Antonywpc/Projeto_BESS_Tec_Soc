import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cadastrarBateria, atualizarBateria, proximoCodigoUnico } from '../api'

const BASE_URL = 'http://localhost:5000/api'

const VAZIO = {
  codigoUnico: '',
  fabricante: '',
  modelo: '',
  quimica: 'LFP',
  dataFabricacao: '',
  sohPercentual: '',
  capacidadeOriginal: '',
  ciclosAnteriores: '0',
  status: 'Em estoque',
  dataEntrada: new Date().toISOString().split('T')[0],
  localizacao: '',
  origem: '',
  motivoSaida: '',
  destinoFinal: '',
}

export default function Cadastro() {
  const { id }                      = useParams()
  const modoEdicao                  = Boolean(id)
  const [form, setForm]             = useState(VAZIO)
  const [loading, setLoading]       = useState(false)
  const [carregando, setCarregando] = useState(modoEdicao)
  const [sucesso, setSucesso]       = useState(false)
  const [erro, setErro]             = useState(null)
  const navigate = useNavigate()

  // Modo Edição: busca os dados da bateria existente
  useEffect(() => {
    if (!modoEdicao) {
      gerarCodigo()
      return
    }
    async function buscarBateria() {
      try {
        const res = await fetch(`${BASE_URL}/baterias/${id}`)
        if (!res.ok) throw new Error('Bateria não encontrada')
        const b = await res.json()
        setForm({
          codigoUnico:        b.codigoUnico,
          fabricante:         b.fabricante,
          modelo:             b.modelo,
          quimica:            b.quimica,
          dataFabricacao:     b.dataFabricacao,
          sohPercentual:      String(b.sohPercentual),
          capacidadeOriginal: String(b.capacidadeOriginal),
          ciclosAnteriores:   String(b.ciclosAnteriores),
          status:             b.status,
          dataEntrada:        b.dataEntrada,
          localizacao:        b.localizacao,
          origem:             b.origem,
          motivoSaida:        b.motivoSaida  ?? '',
          destinoFinal:       b.destinoFinal ?? '',
        })
      } catch (e) {
        setErro(e.message)
      } finally {
        setCarregando(false)
      }
    }
    buscarBateria()
  }, [id, modoEdicao])

  // Gera código automático via backend: I9-AAAA-NNN
  async function gerarCodigo() {
    try {
      const codigo = await proximoCodigoUnico()
      setForm(f => ({ ...f, codigoUnico: codigo }))
    } catch {
      const ano = new Date().getFullYear()
      setForm(f => ({ ...f, codigoUnico: `I9-${ano}-001` }))
    }
  }

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setSucesso(false)
    setErro(null)
  }

  async function enviar(e) {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    setSucesso(false)
    try {
      const payload = {
        ...form,
        sohPercentual:      parseFloat(form.sohPercentual),
        capacidadeOriginal: parseFloat(form.capacidadeOriginal),
        ciclosAnteriores:   parseInt(form.ciclosAnteriores),
        motivoSaida:  form.motivoSaida  || null,
        destinoFinal: form.destinoFinal || null,
        criadoEm:    new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      }
      if (modoEdicao) {
        await atualizarBateria(id, payload)
      } else {
        await cadastrarBateria(payload)
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
    return <div className="empty-state" style={{ marginTop: '4rem' }}><div className="icon">⏳</div>Carregando dados...</div>
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">
            {modoEdicao ? '✏ Editar Bateria' : 'Cadastrar Bateria'}
          </div>
          <div className="page-sub">
            {modoEdicao
              ? `Editando: ${form.codigoUnico}`
              : 'Preencha os dados da bateria de segunda vida'}
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>← Voltar</button>
      </div>

      {sucesso && (
        <div className="alert alert-success">
          ✓ Bateria {modoEdicao ? 'atualizada' : 'cadastrada'} com sucesso! Redirecionando...
        </div>
      )}
      {erro && <div className="alert alert-error">⚠ {erro}</div>}

      <div className="card">
        <form onSubmit={enviar}>
          <div className="form-grid">

            {/* ── Identificação ── */}
            <div className="section-label">🔑 Identificação</div>

            <div className="form-group">
              <label>
                Código Único *
                {!modoEdicao && (
                  <button
                    type="button"
                    onClick={gerarCodigo}
                    style={{
                      marginLeft: '8px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    ↺ gerar novo
                  </button>
                )}
              </label>
              <input
                name="codigoUnico"
                value={form.codigoUnico}
                onChange={handle}
                placeholder="Ex: I9-2025-001"
                required
              />
              {!modoEdicao && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Gerado automaticamente — você pode editar se quiser
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Fabricante *</label>
              <input name="fabricante" value={form.fabricante} onChange={handle}
                placeholder="Ex: CATL, Panasonic, Samsung SDI" required />
            </div>

            <div className="form-group">
              <label>Modelo / Tipo *</label>
              <input name="modelo" value={form.modelo} onChange={handle}
                placeholder="Ex: LiFePO4-100" required />
            </div>

            <div className="form-group">
              <label>Química *</label>
              <select name="quimica" value={form.quimica} onChange={handle} required>
                <option value="LFP">LFP — Lítio Ferro Fosfato</option>
                <option value="NMC">NMC — Níquel Manganês Cobalto</option>
                <option value="LCO">LCO — Lítio Cobalto</option>
                <option value="NCA">NCA — Níquel Cobalto Alumínio</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Data de Fabricação *</label>
              <input type="date" name="dataFabricacao" value={form.dataFabricacao}
                onChange={handle} required />
            </div>

            {/* ── Estado Técnico ── */}
            <div className="section-label">⚡ Estado Técnico</div>

            <div className="form-group">
              <label>SoH % (State of Health) *</label>
              <input type="number" name="sohPercentual" value={form.sohPercentual}
                onChange={handle} min="0" max="100" step="0.1"
                placeholder="Ex: 78.5" required />
            </div>

            <div className="form-group">
              <label>Capacidade Original (kWh) *</label>
              <input type="number" name="capacidadeOriginal" value={form.capacidadeOriginal}
                onChange={handle} min="0" step="0.01"
                placeholder="Ex: 100.00" required />
            </div>

            <div className="form-group">
              <label>Nº de Ciclos Anteriores</label>
              <input type="number" name="ciclosAnteriores" value={form.ciclosAnteriores}
                onChange={handle} min="0" placeholder="Ex: 1240" />
            </div>

            {/* ── Rastreabilidade ── */}
            <div className="section-label">📍 Rastreabilidade</div>

            <div className="form-group">
              <label>Status Atual *</label>
              <select name="status" value={form.status} onChange={handle} required>
                <option value="Em estoque">Em estoque</option>
                <option value="Segunda vida ativa">Segunda vida ativa</option>
                <option value="Descartada">Descartada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Data de Entrada no Inventário *</label>
              <input type="date" name="dataEntrada" value={form.dataEntrada}
                onChange={handle} required />
            </div>

            <div className="form-group">
              <label>Localização Atual *</label>
              <input name="localizacao" value={form.localizacao} onChange={handle}
                placeholder="Ex: Galpão A - Prateleira 3" required />
            </div>

            <div className="form-group">
              <label>Origem (procedência) *</label>
              <input name="origem" value={form.origem} onChange={handle}
                placeholder="Ex: BYD Han EV 2019" required />
            </div>

            {/* ── ESG ── */}
            <div className="section-label">🌱 ESG</div>

            <div className="form-group">
              <label>Motivo de Saída</label>
              <input name="motivoSaida" value={form.motivoSaida} onChange={handle}
                placeholder="Ex: Capacidade abaixo de 70%" />
            </div>

            <div className="form-group">
              <label>Destino Final</label>
              <input name="destinoFinal" value={form.destinoFinal} onChange={handle}
                placeholder="Ex: Reciclagem certificada" />
            </div>

          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? '⏳ Salvando...'
                : modoEdicao ? '✓ Salvar Alterações' : '✓ Cadastrar Bateria'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
