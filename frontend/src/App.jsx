import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Listagem from './pages/Listagem'
import Cadastro from './pages/Cadastro'

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isListagem = pathname === '/'
  const isCadastro = pathname === '/cadastro' || pathname.startsWith('/editar/')

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <span><span className="accent">i9+</span> BESS</span>
          <span className="badge-esg">ESG INVENTÁRIO</span>
        </div>
        <nav className="topbar-nav">
          <button
            className={`nav-btn ${isListagem ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            📋 Listagem
          </button>
          <button
            className={`nav-btn ${isCadastro ? 'active' : ''}`}
            onClick={() => navigate('/cadastro')}
          >
            ＋ Cadastrar Bateria
          </button>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/"            element={<Listagem />} />
          <Route path="/cadastro"    element={<Cadastro />} />
          <Route path="/editar/:id"  element={<Cadastro />} />
        </Routes>
      </main>
    </div>
  )
}
