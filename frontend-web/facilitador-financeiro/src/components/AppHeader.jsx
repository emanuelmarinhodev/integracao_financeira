import { BarChart3, LogOut, UserCircle } from 'lucide-react'

function AppHeader({ usuario, telaAtual, onNavigate, onLogout }) {
  const isLogged = Boolean(usuario)

  return (
    <header className="app-header">
      <button
        className="brand"
        type="button"
        onClick={() => onNavigate(isLogged ? 'dashboard' : 'login')}
        title={isLogged ? 'Voltar para o início' : 'Ir para login'}
      >
        <span className="brand-icon">
          <BarChart3 size={22} />
        </span>

        <span>
          <strong>IntegraFinance</strong>
          <small>Banco Central + Simulação</small>
        </span>
      </button>

      <nav className="header-nav" aria-label="Navegação principal">
        {isLogged ? (
          <>
            <button
              className={`user-pill ${telaAtual === 'perfil' ? 'active' : ''}`}
              type="button"
              onClick={() => onNavigate('perfil')}
              title="Abrir perfil do usuário"
            >
              <UserCircle size={18} />
              <span>{usuario.nome}</span>
            </button>

            <button
              className="logout-button"
              type="button"
              onClick={onLogout}
            >
              <LogOut size={17} />
              Sair
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-link ${telaAtual === 'login' ? 'active' : ''}`}
              type="button"
              onClick={() => onNavigate('login')}
            >
              Login
            </button>

            <button
              className={`nav-link ${telaAtual === 'cadastro' ? 'active' : ''}`}
              type="button"
              onClick={() => onNavigate('cadastro')}
            >
              Cadastro
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

export default AppHeader