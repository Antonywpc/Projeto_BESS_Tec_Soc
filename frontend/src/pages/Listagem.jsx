import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarBaterias, deletarBateria } from '../api'

function statusClass(status) {
  if (status === 'Em estoque')          return 'status-estoque'
  if (status === 'Segunda vida ativa')  return 'status-ativa'
  return 'status-descartada'
}

function SohBar({ valor }) {
  const cor = valor >= 80 ? '#00e5a0' : valor >= 60 ? '#f0a500' : '#f85149'
  return (
    <div className="soh-bar-wrap">
      <div className="soh-bar">
        <div className="soh-fill" style={{ width: `${valor}%`, background: cor }} />
      </div>
      <span className="soh-val" style={{ color: cor }}>{valor}%</span>
    </div>
  )
}

export default function Listagem() {
  const [baterias, setBaterias] = useState([])
  const [loading, setLoading]   = useState(true)
  const [erro, setErro]         = useState(null)
  const navigate = useNavigate()

  async function carregar() {
    try {
      setLoading(true)
      setErro(null)
      setBaterias(await listarBaterias())
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  async function remover(id, codigo) {
    if (!confirm(`Remover bateria ${codigo}?`)) return
    try {
      await deletarBateria(id)
      await carregar()
    } catch (e) {
      alert(e.message)
    }
  }

  // Estatísticas rápidas
  const total     = baterias.length
  const ativas    = baterias.filter(b => b.status === 'Segunda vida ativa').length
  const estoque   = baterias.filter(b => b.status === 'Em estoque').length
  const sohMedio  = total
    ? (baterias.reduce((s, b) => s + b.sohPercentual, 0) / total).toFixed(1)
    : '—'

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Inventário de Baterias</div>
          <div className="page-sub">Rastreabilidade de ativos com circularidade ESG</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/cadastro')}>
          + Nova Bateria
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total cadastrado</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent2)' }}>{estoque}</div>
          <div className="stat-label">Em estoque</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{ativas}</div>
          <div className="stat-label">Segunda vida ativa</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--warn)' }}>{sohMedio}%</div>
          <div className="stat-label">SoH médio</div>
        </div>
      </div>

      {erro && <div className="alert alert-error">⚠ {erro} — verifique se o backend está rodando.</div>}

      <div className="card">
        {loading ? (
          <div className="empty-state"><div className="icon">⏳</div>Carregando...</div>
        ) : baterias.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔋</div>
            <p>Nenhuma bateria cadastrada ainda.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/cadastro')}>
              Cadastrar primeira bateria
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Fabricante / Modelo</th>
                  <th>Química</th>
                  <th>SoH</th>
                  <th>Capacidade</th>
                  <th>Status</th>
                  <th>Localização</th>
                  <th>Entrada</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {baterias.map(b => (
                  <tr key={b.id}>
                    <td><span className="code">{b.codigoUnico}</span></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.fabricante}</div>
                      <div className="text-muted">{b.modelo}</div>
                    </td>
                    <td><span className="code">{b.quimica}</span></td>
                    <td><SohBar valor={b.sohPercentual} /></td>
                    <td>{b.capacidadeOriginal} kWh</td>
                    <td>
                      <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="text-muted">{b.localizacao}</td>
                    <td className="text-muted">{b.dataEntrada}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                          onClick={() => navigate(`/editar/${b.id}`)}
                        >
                          ✏ Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                          onClick={() => remover(b.id, b.codigoUnico)}
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
