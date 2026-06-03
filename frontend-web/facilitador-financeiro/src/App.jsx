import { useState } from 'react'
import AppHeader from './components/AppHeader'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

const STORAGE_KEY = 'integrafinance_usuario'

function getUsuarioSalvo() {
  const usuarioSalvo = localStorage.getItem(STORAGE_KEY)
  if (!usuarioSalvo) return null

  try {
    return JSON.parse(usuarioSalvo)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function App() {
  const [usuario, setUsuario] = useState(getUsuarioSalvo)
  const [telaAtual, setTelaAtual] = useState(() => (getUsuarioSalvo() ? 'dashboard' : 'login'))

  function salvarUsuario(usuarioAtualizado) {
    setUsuario(usuarioAtualizado)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioAtualizado))
  }

  function handleLogin(usuarioLogado) {
    salvarUsuario(usuarioLogado)
    setTelaAtual('dashboard')
  }

  function handleLogout() {
    setUsuario(null)
    localStorage.removeItem(STORAGE_KEY)
    setTelaAtual('login')
  }

  function renderLoggedPage() {
    if (telaAtual === 'perfil') {
      return <ProfilePage usuario={usuario} onUserUpdate={salvarUsuario} />
    }

    return <DashboardPage usuario={usuario} onUserUpdate={salvarUsuario} />
  }

  return (
    <main className="page-shell">
      <AppHeader usuario={usuario} telaAtual={telaAtual} onNavigate={setTelaAtual} onLogout={handleLogout} />

      {usuario ? (
        renderLoggedPage()
      ) : telaAtual === 'cadastro' ? (
        <RegisterPage onRegister={handleLogin} onGoToLogin={() => setTelaAtual('login')} />
      ) : (
        <LoginPage onLogin={handleLogin} onGoToCadastro={() => setTelaAtual('cadastro')} />
      )}
    </main>
  )
}

export default App
