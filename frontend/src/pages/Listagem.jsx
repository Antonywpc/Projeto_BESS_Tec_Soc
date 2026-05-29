import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { deletarCadastro } from '../api'

const BASE = 'http://localhost:5000/api'
const OPCOES_POR_PAGINA = [10, 25, 50, 100]

async function fetchCadastros({ busca, pagina, porPagina }) {
  const params = new URLSearchParams({ pagina, porPagina })
  if (busca) params.set('busca', busca)
  const res = await fetch(`${BASE}/cadastros?${params}`)
  if (!res.ok) throw new Error('Falha ao buscar registros')
  return res.json()
}

export default function Listagem() {
  const navigate = useNavigate()

  const [itens,        setItens]        = useState([])
  const [total,        setTotal]        = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [pagina,       setPagina]       = useState(1)
  const [porPagina,    setPorPagina]    = useState(10)
  const [busca,        setBusca]        = useState('')
  const [buscaInput,   setBuscaInput]   = useState('')
  const [loading,      setLoading]      = useState(true)
  const [erro,         setErro]         = useState(null)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      setErro(null)
      const data = await fetchCadastros({ busca, pagina, porPagina })
      setItens(data.itens)
      setTotal(data.total)
      setTotalPaginas(data.totalPaginas)
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }, [busca, pagina, porPagina])

  useEffect(() => { carregar() }, [carregar])

  // Busca com debounce de 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setBusca(buscaInput)
      setPagina(1)
    }, 400)
    return () => clearTimeout(t)
  }, [buscaInput])

  function handlePorPagina(e) {
    setPorPagina(Number(e.target.value))
    setPagina(1)
  }

  async function remover(id, label) {
    if (!confirm(`Remover registro ${label}?`)) return
    try {
      await deletarCadastro(id)
      carregar()
    } catch (e) {
      alert(e.message)
    }
  }

  // Gera array de páginas para o paginador
  function paginasVisiveis() {
    const delta = 2
    const range = []
    for (let i = Math.max(1, pagina - delta); i <= Math.min(totalPaginas, pagina + delta); i++) {
      range.push(i)
    }
    if (range[0] > 1) { range.unshift('...'); range.unshift(1) }
    if (range[range.length - 1] < totalPaginas) { range.push('...'); range.push(totalPaginas) }
    return range
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Inventário de Veículos Elétricos</div>
          <div className="page-sub">
            {total > 0 ? `${total.toLocaleString('pt-BR')} registros encontrados` : 'Carregando...'}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/cadastro')}>
          + Novo Cadastro
        </button>
      </div>

      {/* Barra de controles */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Busca */}
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', fontSize: '0.9rem', pointerEvents: 'none'
          }}>🔍</span>
          <input
            value={buscaInput}
            onChange={e => setBuscaInput(e.target.value)}
            placeholder="Buscar por chassi ou fabricante..."
            style={{ paddingLeft: '36px', width: '100%' }}
          />
        </div>

        {/* Itens por página */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Itens por página:</span>
          <select value={porPagina} onChange={handlePorPagina} style={{ width: 'auto' }}>
            {OPCOES_POR_PAGINA.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {erro && <div className="alert alert-error">⚠ {erro} — verifique se o backend está rodando.</div>}

      <div className="card">
        {loading ? (
          <div className="empty-state"><div className="icon">⏳</div>Carregando...</div>
        ) : itens.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔋</div>
            <p>{busca ? `Nenhum resultado para "${busca}"` : 'Nenhum registro encontrado.'}</p>
            {!busca && (
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/cadastro')}>
                Novo cadastro
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Chassi</th>
                    <th>Fabricante</th>
                    <th>Modelo</th>
                    <th>Tecnologia</th>
                    <th>Classificação</th>
                    <th>Cidade</th>
                    <th>Ano</th>
                    <th>Qtd</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map(b => (
                    <tr key={b.id}>
                      <td className="text-muted" style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>{b.id}</td>
                      <td>
                        <span className="code">
                          {b.numeroChassi ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.fabricante}</td>
                      <td className="text-muted">{b.modelo}</td>
                      <td>
                        <span className="status-badge status-ativa">{b.tecnologia}</span>
                      </td>
                      <td className="text-muted">{b.classificacao}</td>
                      <td className="text-muted">{b.cidade}</td>
                      <td className="text-muted">
                        {b.anoInicial}{b.anoFinal && b.anoFinal !== b.anoInicial ? `–${b.anoFinal}` : ''}
                      </td>
                      <td className="text-muted">{b.quantidade ?? '—'}</td>
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
                            onClick={() => remover(b.id, b.numeroChassi ?? `#${b.id}`)}
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

            {/* Paginação */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Página {pagina} de {totalPaginas} · {total.toLocaleString('pt-BR')} registros
              </span>

              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                  onClick={() => setPagina(p => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                >
                  ← Anterior
                </button>

                {paginasVisiveis().map((p, i) =>
                  p === '...'
                    ? <span key={`dots-${i}`} style={{ padding: '5px 8px', color: 'var(--text-muted)', alignSelf: 'center' }}>…</span>
                    : <button
                        key={p}
                        className={`btn ${p === pagina ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '5px 12px', fontSize: '0.8rem', minWidth: '36px' }}
                        onClick={() => setPagina(p)}
                      >
                        {p}
                      </button>
                )}

                <button
                  className="btn btn-secondary"
                  style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                >
                  Próxima →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}