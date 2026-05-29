import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts'

const BASE = 'http://localhost:5000/api'

const COLORS = ['#22ffa7','#3b82f6','#f59e0b','#ec4899','#a78bfa','#34d399','#fb923c','#60a5fa','#fbbf24','#f472b6']

function fmt(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k'
  return n?.toLocaleString('pt-BR') ?? '0'
}

function KpiCard({ icon, valor, label, sub, cor }) {
  return (
    <div className="stat-card">
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      <div className="stat-value" style={{ color: cor }}>{valor}</div>
      <div className="stat-label">{label}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: '3px', fontFamily: 'var(--mono)' }}>{sub}</div>}
    </div>
  )
}

function ChartCard({ title, sub, tag, tagColor, children, height = 260 }) {
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</div>
          {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>}
        </div>
        {tag && (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '0.65rem', padding: '3px 8px',
            borderRadius: 4, border: `1px solid ${tagColor}33`,
            background: `${tagColor}11`, color: tagColor, whiteSpace: 'nowrap'
          }}>{tag}</span>
        )}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  )
}

const TOOLTIP_STYLE = {
  contentStyle: { background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' },
  labelStyle: { color: '#22ffa7', fontWeight: 700 },
  cursor: { fill: 'rgba(255,255,255,0.04)' }
}

const AXIS_STYLE = { fill: '#64748b', fontSize: 11, fontFamily: 'DM Mono, monospace' }

export default function Dashboard() {
  const [dados,    setDados]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [erro,     setErro]     = useState(null)

  useEffect(() => {
    fetch(`${BASE}/dashboard`)
      .then(r => { if (!r.ok) throw new Error('Falha ao carregar dashboard'); return r.json() })
      .then(d => { setDados(d); setLoading(false) })
      .catch(e => { setErro(e.message); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="empty-state" style={{ marginTop: '4rem' }}>
      <div className="icon">⏳</div>Carregando dashboard...
    </div>
  )

  if (erro) return (
    <div className="alert alert-error" style={{ margin: '2rem 0' }}>
      ⚠ {erro} — verifique se o backend está rodando.
    </div>
  )

  const { kpis, porTecnologia, porClassificacao, topFabricantes, topModelos, porAno, topEstados } = dados

  // Formata porAno para mostrar só anos com dado
  const anoData = (porAno ?? []).filter(d => d.ano >= 2010)

  // Donut de tecnologia — limita a 6 e agrupa o resto em "Outros"
  const tecData = (() => {
    const top = [...(porTecnologia ?? [])].slice(0, 6)
    const resto = (porTecnologia ?? []).slice(6).reduce((s, d) => s + d.quantidade, 0)
    if (resto > 0) top.push({ tecnologia: 'Outros', quantidade: resto })
    return top
  })()

  const totalTec = tecData.reduce((s, d) => s + d.quantidade, 0)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard ESG</div>
          <div className="page-sub">Visão geral da frota de veículos elétricos — dados em tempo real</div>
        </div>
      </div>

      {/* KPIs */}
      <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
        <KpiCard icon="⚡" valor={fmt(kpis.totalRegistros)}   label="Registros no banco"    cor="var(--text)" />
        <KpiCard icon="🏭" valor={fmt(kpis.totalFabricantes)} label="Fabricantes únicos"     cor="var(--accent2)" />
        <KpiCard icon="🚗" valor={fmt(kpis.totalModelos)}     label="Modelos diferentes"     cor="var(--accent3)" />
        <KpiCard icon="🏙️" valor={fmt(kpis.totalCidades)}     label="Municípios com VE"      cor="var(--accent)" />
        <KpiCard
          icon="🔋"
          valor={fmt(kpis.totalComChassi)}
          label="Com laudo i9+"
          sub={`${((kpis.totalComChassi / kpis.totalRegistros) * 100).toFixed(1)}% do total`}
          cor="var(--accent)"
        />
      </div>

      {/* Grid de gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Evolução por ano — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <ChartCard
            title="Evolução da Frota por Ano"
            sub="Quantidade de registros por ano inicial cadastrado"
            tag="CRESCIMENTO"
            tagColor="#22ffa7"
            height={240}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anoData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="ano" tick={AXIS_STYLE} />
                <YAxis tick={AXIS_STYLE} tickFormatter={fmt} />
                <Tooltip {...TOOLTIP_STYLE} formatter={v => [v.toLocaleString('pt-BR'), 'Registros']} />
                <Bar dataKey="quantidade" fill="#22ffa7" radius={[4,4,0,0]}
                  label={false}
                >
                  {anoData.map((_, i) => (
                    <Cell key={i} fill={i >= anoData.length - 3 ? '#22ffa7' : 'rgba(34,255,167,0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Tecnologia — donut */}
        <ChartCard
          title="Distribuição por Tecnologia"
          sub="Mix de tecnologias da frota registrada"
          tag="MIX ENERGÉTICO"
          tagColor="#3b82f6"
          height={280}
        >
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', gap: '1rem' }}>
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie data={tecData} dataKey="quantidade" nameKey="tecnologia"
                  cx="50%" cy="50%" innerRadius="55%" outerRadius="80%"
                  paddingAngle={2}
                >
                  {tecData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE}
                  formatter={(v, name) => [`${v.toLocaleString('pt-BR')} (${(v/totalTec*100).toFixed(1)}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tecData.map((d, i) => (
                <div key={d.tecnologia} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.tecnologia}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                      {(d.quantidade / totalTec * 100).toFixed(1)}% · {fmt(d.quantidade)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Classificação */}
        <ChartCard
          title="Por Tipo de Veículo"
          sub="Segmentos da frota eletrificada"
          tag="SEGMENTOS"
          tagColor="#f59e0b"
          height={280}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={porClassificacao ?? []}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={AXIS_STYLE} tickFormatter={fmt} />
              <YAxis type="category" dataKey="classificacao" tick={{ ...AXIS_STYLE, fill: '#f1f5f9', fontSize: 11 }} width={110} />
              <Tooltip {...TOOLTIP_STYLE} formatter={v => [v.toLocaleString('pt-BR'), 'Registros']} />
              <Bar dataKey="quantidade" radius={[0,4,4,0]}>
                {(porClassificacao ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top fabricantes */}
        <ChartCard
          title="Top 10 Fabricantes"
          sub="Por volume de registros no banco"
          tag="FABRICANTES"
          tagColor="#ec4899"
          height={280}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topFabricantes ?? []}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={AXIS_STYLE} tickFormatter={fmt} />
              <YAxis type="category" dataKey="fabricante" tick={{ ...AXIS_STYLE, fill: '#f1f5f9', fontSize: 10 }} width={110} />
              <Tooltip {...TOOLTIP_STYLE} formatter={v => [v.toLocaleString('pt-BR'), 'Registros']} />
              <Bar dataKey="quantidade" radius={[0,4,4,0]}>
                {(topFabricantes ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top estados */}
        <ChartCard
          title="Top 10 Estados"
          sub="Concentração geográfica da frota"
          tag="GEOGRAFIA"
          tagColor="#22ffa7"
          height={280}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topEstados ?? []}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="estado" tick={AXIS_STYLE} />
              <YAxis tick={AXIS_STYLE} tickFormatter={fmt} />
              <Tooltip {...TOOLTIP_STYLE} formatter={v => [v.toLocaleString('pt-BR'), 'Registros']} />
              <Bar dataKey="quantidade" radius={[4,4,0,0]}>
                {(topEstados ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top modelos — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <ChartCard
            title="Top 10 Modelos"
            sub="Modelos com maior número de registros"
            tag="MODELOS"
            tagColor="#3b82f6"
            height={220}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topModelos ?? []} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="modelo" tick={{ ...AXIS_STYLE, fontSize: 10 }}
                  tickFormatter={v => v.length > 16 ? v.slice(0,14) + '…' : v} />
                <YAxis tick={AXIS_STYLE} tickFormatter={fmt} />
                <Tooltip {...TOOLTIP_STYLE} formatter={v => [v.toLocaleString('pt-BR'), 'Registros']} />
                <Bar dataKey="quantidade" radius={[4,4,0,0]}>
                  {(topModelos ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>
    </>
  )
}